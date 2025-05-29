// components/Dashboard/Dashboard.jsx
import React from 'react';
import StatsCard from '../components/StatsCard';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import { useAuth } from '../context/AuthContext'; // Importar el contexto
import LineChart from '../components/LineChart';
import CategoryChart from '../components/CategoryChart';
import '../css/dashboard.css';

const Dashboard = ({ userName = "Marcos López" }) => {

    const { user, isAdmin, logout: authLogout } = useAuth(); // Usar el contexto
  // Datos de ejemplo
  const statsData = {
    totalSales: 5000.00,
    totalOrders: 50
  };

  const categoryData = [
    { name: 'Carne de res', value: 35, color: '#7c2d12' },
    { name: 'Carne de cerdo', value: 25, color: '#991b1b' },
    { name: 'Pollo', value: 20, color: '#dc2626' },
    { name: 'Mariscos', value: 15, color: '#ef4444' },
    { name: 'Artículos de cocina', value: 12, color: '#f87171' },
    { name: 'Salsas', value: 10, color: '#fca5a5' },
    { name: 'Cortes premium', value: 8, color: '#fecaca' }
  ];

  const suppliersData = [
    { name: 'Proveedor 1', value: 45 },
    { name: 'Proveedor 2', value: 35 },
    { name: 'Proveedor 3', value: 25 },
    { name: 'Proveedor 4', value: 30 },
    { name: 'Proveedor 5', value: 20 }
  ];

  const priceScaleData = [
    { month: 'Ene', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Abr', value: 61 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 67 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Bienvenido@ al servicio de gestión de la tienda El Corte, 
          <span className="user-name">{user.name}</span>
        </h1>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-row">
          <div className="dashboard-col-4">
            <StatsCard 
              title="Lo más vendido"
              value={`${statsData.totalSales.toLocaleString()}`}
              subtitle={`${statsData.totalOrders} Orders`}
              period="This Week"
            >
              <DonutChart data={categoryData.slice(0, 3)} />
            </StatsCard>
          </div>

          <div className="dashboard-col-8">
            <CategoryChart 
              title="Categorías más vendidas"
              data={categoryData}
              period="This Week"
            />
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col-6">
            <BarChart 
              title="Principales proveedores"
              data={suppliersData}
              period="This Week"
            />
          </div>

          <div className="dashboard-col-6">
            <LineChart 
              title="Escala de precios"
              value={`${statsData.totalSales.toLocaleString()}`}
              subtitle={`${statsData.totalOrders} Orders`}
              data={priceScaleData}
              period="This Week"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;