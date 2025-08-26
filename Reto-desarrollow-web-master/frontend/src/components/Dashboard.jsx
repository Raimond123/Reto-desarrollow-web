import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ListaUsuarios from './ListaUsuarios';
import FormularioUsuario from './FormularioUsuario';

const EvaluadorDashboard = () => {
  const { user, logout } = useAuth();
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
  };

  const handleCancelarEdicion = () => {
    setUsuarioEditando(null);
  };

  const handleGuardarUsuario = () => {
    setUsuarioEditando(null);
    setRefreshTrigger(prev => prev + 1);
    setMensaje('Usuario guardado exitosamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleEliminarUsuario = () => {
    setRefreshTrigger(prev => prev + 1);
    setMensaje('Usuario eliminado exitosamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <div className="app-header">
        <div>
          <h1>Sistema de Gestión de Usuarios</h1>
          <p>Panel de Evaluador</p>
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

      {mensaje && (
        <div className="success">
          {mensaje}
        </div>
      )}

      <FormularioUsuario
        usuario={usuarioEditando}
        onGuardar={handleGuardarUsuario}
        onCancelar={handleCancelarEdicion}
      />

      <ListaUsuarios
        onEditarUsuario={handleEditarUsuario}
        onEliminarUsuario={handleEliminarUsuario}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default EvaluadorDashboard;
