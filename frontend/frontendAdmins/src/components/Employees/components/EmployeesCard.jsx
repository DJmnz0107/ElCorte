import React from 'react';
import { MdEdit, MdDelete, MdEmail, MdWork, MdAttachMoney, MdBadge } from 'react-icons/md';
import '../css/employeesCard.css'; 

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <article className="employee-card" aria-label={`Empleado ${employee.firstName} ${employee.lastName}`}>
      <header className="employee-card-header">
        <h3 className="employee-name">{employee.firstName} {employee.lastName}</h3>
      </header>
      
      <section className="employee-card-body">
        <div className="employee-info">

          <div className="info-item">
            <MdEmail className="info-icon" aria-hidden="true" />
            <span className="info-label">Correo:</span>
            <span className="info-value">{employee.email}</span>
          </div>

          <div className="info-item">
  <MdBadge className="info-icon" aria-hidden="true" />
  <span className="info-label">DUI:</span>
  <span className="info-value">{employee.EmployeeDui}</span>
</div>
          <div className="info-item">
            <MdAttachMoney className="info-icon" aria-hidden="true" />
            <span className="info-label">Salario:</span>
            <span className="info-value">${employee.salary}</span>
          </div>

          <div className="info-item">
            <MdWork className="info-icon" aria-hidden="true" />
            <span className="info-label">Rol:</span>
            <span className="info-value">{employee.role}</span>
          </div>

          <div className="info-item">
  <span className="info-label">Fecha de nacimiento:</span>
  <span className="info-value">{new Date(employee.birthdate).toLocaleDateString()}</span>
</div>
        </div>
      </section>
      
      <footer className="employee-card-footer">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(employee)}
          aria-label={`Editar empleado ${employee.firstName} ${employee.lastName}`}
        >
          <MdEdit className="btn-icon" aria-hidden="true" />
          Editar
        </button>
        
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(employee)} 
          aria-label={`Eliminar empleado ${employee.firstName} ${employee.lastName}`}
        >
          <MdDelete className="btn-icon" aria-hidden="true" />
          Eliminar
        </button>
      </footer>
    </article>
  );
};

export default EmployeeCard;
