import React from 'react';
import { useAuth } from '../context/AuthContext';

const AnalistaDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <div className="app-header">
        <div>
          <h1>Panel de Analista</h1>
          <p>Sistema de Análisis de Datos</p>
        </div>
        <div className="user-info">
          <span>Bienvenido, {user?.nombre}</span>
          <span>({user?.rol})</span>
          <button 
            className="btn btn-logout"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Funcionalidades del Analista</h2>
        <p>Aquí se implementarán las funcionalidades específicas para el rol de Analista:</p>
        <ul>
          <li>Análisis de datos</li>
          <li>Generación de reportes</li>
          <li>Visualización de métricas</li>
          <li>Dashboard de estadísticas</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalistaDashboard;
