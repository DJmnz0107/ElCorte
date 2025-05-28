import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import SupplierCard from '../components/Suppliers/Components/SuppliersCard';
import SupplierModal from '../components/Suppliers/Components/ModalSuppliers';
import ConfirmationModal from '../components/Suppliers/Components/ConfirmationModal';
import '../css/suppliers.css';
import useDataSuppliersInterface from '../components/Suppliers/hooks/useDataSuppliersInterface';

const Proveedores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [supplierToDeleteId, setSupplierToDeleteId] = useState(null);
  const [supplierToDeleteName, setSupplierToDeleteName] = useState('');
  const [supplierToUpdate, setSupplierToUpdate] = useState(null);

  const {
    suppliers,
    loading,
    handleAddSupplierBackend,
    handleUpdateSupplierBackend,
    handleDeleteSupplierBackend,
    getSupplierId,
  } = useDataSuppliersInterface();

  // Filtrado de proveedores
  useEffect(() => {
    if (!suppliers) {
      setFilteredSuppliers([]);
      return;
    }

    if (searchTerm === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.suppliersName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone?.includes(searchTerm) ||
        supplier.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  const handleAddSupplier = () => {
    setModalMode('add');
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setModalMode('edit');
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

 const handleDeleteSupplier = (supplier) => {
  console.log('Proveedor a eliminar:', supplier); // Agregar para depuración
  
  const id = getSupplierId(supplier);
  console.log('ID obtenido:', id); // Verificar el ID obtenido
  
  if (!id) {
    console.error('No se pudo obtener el ID del proveedor. Estructura completa:', supplier);
    toast.error('No se pudo obtener el ID del proveedor');
    return;
  }
  
  setSupplierToDeleteId(id);
  setSupplierToDeleteName(supplier.suppliersName || 'Proveedor sin nombre');
  setIsDeleteModalOpen(true);
};

  const confirmDeleteSupplier = async () => {
    if (supplierToDeleteId) {
      try {
        await handleDeleteSupplierBackend(supplierToDeleteId);
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setSupplierToDeleteId(null);
        setSupplierToDeleteName('');
      }
    }
  };

  const handleSaveSupplier = async (supplierData) => {
    try {
      if (modalMode === 'add') {
        await handleAddSupplierBackend(supplierData);
        setIsModalOpen(false);
      } else {
        // Asegurarnos de incluir el ID en los datos para actualizar
        const updatedData = {
          ...supplierData,
          _id: getSupplierId(selectedSupplier),
        };
        setSupplierToUpdate(updatedData);
        setIsUpdateModalOpen(true);
      }
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  };

  const confirmUpdateSupplier = async () => {
    if (supplierToUpdate) {
      try {
        await handleUpdateSupplierBackend(supplierToUpdate);
      } catch (error) {
        console.error('Error al actualizar proveedor:', error);
      } finally {
        setIsUpdateModalOpen(false);
        setIsModalOpen(false);
        setSelectedSupplier(null);
        setModalMode('add');
        setSupplierToUpdate(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
    setModalMode('add');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && !suppliers) {
    return (
      <div className="suppliers-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h1 className="suppliers-title">Gestión de proveedores</h1>

        <div className="suppliers-actions">
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button
            className="btn btn-add"
            onClick={handleAddSupplier}
          >
            <MdAdd className="btn-icon" />
            Agregar
          </button>
        </div>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="no-suppliers">
          <p>No se encontraron proveedores.</p>
          {searchTerm && <p>Intenta con un término de búsqueda diferente.</p>}
        </div>
      ) : (
        <div className="suppliers-grid">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={getSupplierId(supplier)}
              supplier={supplier}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
          ))}
        </div>
      )}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSupplier}
        title="¿Estás seguro?"
        message="Esta acción eliminará permanentemente al proveedor"
        supplierName={supplierToDeleteName}
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <ConfirmationModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={confirmUpdateSupplier}
        title="¿Confirmar cambios?"
        message="Se actualizará la información del proveedor"
        supplierName={supplierToUpdate?.suppliersName}
        type="success"
        confirmText="Actualizar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Proveedores;