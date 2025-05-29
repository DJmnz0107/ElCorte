import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import EmployeeCard from '../components/Employees/components/EmployeesCard';
import EmployeeModal from '../components/Employees/components/ModalEmployees';
import ConfirmationModal from '../components/Employees/components/ConfirmationModalEmployee';
import '../css/employees.css';
import useDataEmployeesInterface from '../components/Employees/hooks/useDataAddEmployeeInterface';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);
  const [employeeToDeleteName, setEmployeeToDeleteName] = useState('');
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);

  const {
    employees,
    loading,
    handleAddEmployeeBackend,
    handleUpdateEmployeeBackend,
    handleDeleteEmployeeBackend,
    getEmployeeId,
  } = useDataEmployeesInterface();

  useEffect(() => {
    if (!employees) {
      setFilteredEmployees([]);
      return;
    }

    if (searchTerm === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleAddEmployee = () => {
    setModalMode('add');
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    const id = getEmployeeId(employee);
    if (!id) {
      console.error('No se pudo obtener el ID del empleado');
      return;
    }

    setEmployeeToDeleteId(id);
    setEmployeeToDeleteName(`${employee.firstName} ${employee.lastName}`);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (employeeToDeleteId) {
      try {
        await handleDeleteEmployeeBackend(employeeToDeleteId);
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setEmployeeToDeleteId(null);
        setEmployeeToDeleteName('');
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (modalMode === 'add') {
        await handleAddEmployeeBackend({
          ...employeeData,
          role: 'Employee', // Asignar rol automáticamente
        });
        setIsModalOpen(false);
      } else {
        const updatedData = {
          ...employeeData,
          _id: getEmployeeId(selectedEmployee),
        };
        setEmployeeToUpdate(updatedData);
        setIsUpdateModalOpen(true);
      }
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const confirmUpdateEmployee = async () => {
    if (employeeToUpdate) {
      try {
        await handleUpdateEmployeeBackend(employeeToUpdate);
      } catch (error) {
        console.error('Error al actualizar empleado:', error);
      } finally {
        setIsUpdateModalOpen(false);
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setModalMode('add');
        setEmployeeToUpdate(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setModalMode('add');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading && !employees) {
    return (
      <div className="employees-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1 className="employees-title">Gestión de empleados</h1>

        <div className="employees-actions">
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button className="btn btn-add" onClick={handleAddEmployee}>
            <MdAdd className="btn-icon" />
            Agregar
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="no-employees">
          <p>No se encontraron empleados.</p>
          {searchTerm && <p>Intenta con un término de búsqueda diferente.</p>}
        </div>
      ) : (
        <div className="employees-grid">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={getEmployeeId(employee)}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteEmployee}
        title="¿Estás seguro?"
        message="Esta acción eliminará permanentemente al empleado"
        supplierName={employeeToDeleteName}
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <ConfirmationModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={confirmUpdateEmployee}
        title="¿Confirmar cambios?"
        message="Se actualizará la información del empleado"
        supplierName={`${employeeToUpdate?.firstName} ${employeeToUpdate?.lastName}`}
        type="success"
        confirmText="Actualizar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Employees;
