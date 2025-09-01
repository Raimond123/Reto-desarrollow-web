import React from 'react';
import { useAuth } from '../context/AuthContext';
import EvaluadorDashboard from './EvaluadorDashboard';
import AnalistaDashboard from './AnalistaDashboard';
import RegistroDashboard from './RegistroDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.rol) {
      case 'evaluador':
        return <EvaluadorDashboard />;
      case 'analista':
        return <AnalistaDashboard />;
      case 'registro':
        return <RegistroDashboard />;
      default:
        return (
          <div className="container">
            <div className="error">
              Rol no reconocido: {user?.rol}
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default RoleBasedDashboard;
