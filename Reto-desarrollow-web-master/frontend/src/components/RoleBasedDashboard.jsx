import React from 'react';
import { useAuth } from '../context/AuthContext';
import EvaluadorDashboard from './EvaluadorDashboard';
import AnalistaDashboard from './AnalistaDashboard';
import RegistroDashboard from './RegistroDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if(user?.rol == null){
      return (
        <div className="container">
            <div className="error">
              Este usuario no tiene un rol asignado 😠
            </div>
        </div>
      );
    }

    let stringRol = String(user?.rol)

     switch (stringRol.toLowerCase()) {
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
