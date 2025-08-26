import React, { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';

const ListaUsuarios = ({ onEditarUsuario, onEliminarUsuario, refreshTrigger }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, [refreshTrigger]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usuariosService.obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await usuariosService.eliminarUsuario(id);
        onEliminarUsuario();
        cargarUsuarios();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="card">
      <h2>Lista de Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.usu_id}>
                <td>{usuario.usu_id}</td>
                <td>{usuario.usu_nombre}</td>
                <td>{usuario.usu_correo}</td>
                <td>{usuario.usu_rol}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => onEditarUsuario(usuario)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminar(usuario.usu_id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaUsuarios;
