import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import CustomerCard from '../components/Customers/Components/CustomerCard';
import CustomerModal from '../components/Customers/Components/CustomerModal';
import ConfirmationModal from '../components/Customers/Components/ConfirmationModal';
import '../css/customers.css';
import useDataCustomersInterface from '../components/Customers/Hooks/useDataCustomersInterface';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);
  const [customerToDeleteName, setCustomerToDeleteName] = useState('');
  const [customerToUpdate, setCustomerToUpdate] = useState(null);

  const {
    customers,
    loading,
    handleAddCustomerBackend,
    handleUpdateCustomerBackend,
    handleDeleteCustomerBackend,
    getCustomerId,
  } = useDataCustomersInterface();

  useEffect(() => {
    if (!customers) {
      setFilteredCustomers([]);
      return;
    }

    if (searchTerm === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleAddCustomer = () => {
    setModalMode('add');
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    const id = getCustomerId(customer);
    if (!id) {
      console.error('No se pudo obtener el ID del cliente');
      return;
    }

    setCustomerToDeleteId(id);
    setCustomerToDeleteName(`${customer.firstName} ${customer.lastName}`);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (customerToDeleteId) {
      try {
        await handleDeleteCustomerBackend(customerToDeleteId);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setCustomerToDeleteId(null);
        setCustomerToDeleteName('');
      }
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (modalMode === 'add') {
        await handleAddCustomerBackend(customerData);
        setIsModalOpen(false);
      } else {
        const updatedData = {
          ...customerData,
          _id: getCustomerId(selectedCustomer),
        };
        setCustomerToUpdate(updatedData);
        setIsUpdateModalOpen(true);
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const confirmUpdateCustomer = async () => {
    if (customerToUpdate) {
      try {
        await handleUpdateCustomerBackend(customerToUpdate);
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
      } finally {
        setIsUpdateModalOpen(false);
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setModalMode('add');
        setCustomerToUpdate(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setModalMode('add');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && !customers) {
    return (
      <div className="customers-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1 className="customers-title">Gestión de clientes</h1>

        <div className="customers-actions">
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button className="btn btn-add" onClick={handleAddCustomer}>
            <MdAdd className="btn-icon" />
            Agregar
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="no-customers">
          <p>No se encontraron clientes.</p>
          {searchTerm && <p>Intenta con un término de búsqueda diferente.</p>}
        </div>
      ) : (
        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={getCustomerId(customer)}
              customer={customer}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
            />
          ))}
        </div>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCustomer}
        title="¿Estás seguro?"
        message="Esta acción eliminará permanentemente al cliente"
        supplierName={customerToDeleteName}
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <ConfirmationModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={confirmUpdateCustomer}
        title="¿Confirmar cambios?"
        message="Se actualizará la información del cliente"
        supplierName={`${customerToUpdate?.firstName} ${customerToUpdate?.lastName}`}
        type="success"
        confirmText="Actualizar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Customers;