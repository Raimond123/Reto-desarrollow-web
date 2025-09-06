import React, { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';

const UsuariosCRUD = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    usu_nombre: '',
    usu_correo: '',
    usu_contrasena: '',
    usu_rol: 'registro',
    usu_activo: true
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosService.obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Para actualización, solo enviar campos que no estén vacíos
        const updateData = {
          usu_nombre: formData.usu_nombre,
          usu_correo: formData.usu_correo,
          usu_rol: formData.usu_rol
        };
        // Solo incluir contraseña si se proporcionó una nueva
        if (formData.usu_contrasena && formData.usu_contrasena.trim() !== '') {
          updateData.usu_contrasena = formData.usu_contrasena;
        }
        await usuariosService.actualizarUsuario(editingUser.usu_id, updateData);
      } else {
        await usuariosService.crearUsuario(formData);
      }
      await cargarUsuarios();
      resetForm();
    } catch (err) {
      setError('Error al guardar usuario: ' + err.message);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      usu_nombre: usuario.usu_nombre,
      usu_correo: usuario.usu_correo,
      usu_contrasena: '',
      usu_rol: usuario.usu_rol,
      usu_activo: usuario.usu_activo
    });
    setShowForm(true);
  };

  const handleToggleActive = async (usuario) => {
    try {
      await usuariosService.toggleUsuarioActivo(usuario.usu_id, !usuario.usu_activo);
      await cargarUsuarios();
    } catch (err) {
      setError('Error al cambiar estado del usuario: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      usu_nombre: '',
      usu_correo: '',
      usu_contrasena: '',
      usu_rol: 'registro',
      usu_activo: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-crud">
      <div className="crud-header">
        <h2>👥 Gestión de Usuarios</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Usuario'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="usuario-form-container">
          <h3>{editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h3>
          <form onSubmit={handleSubmit} className="usuario-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={formData.usu_nombre}
                onChange={(e) => setFormData({...formData, usu_nombre: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                value={formData.usu_correo}
                onChange={(e) => setFormData({...formData, usu_correo: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={formData.usu_contrasena}
                onChange={(e) => setFormData({...formData, usu_contrasena: e.target.value})}
                required={!editingUser}
                placeholder={editingUser ? 'Dejar vacío para mantener actual' : ''}
              />
            </div>
            
            <div className="form-group">
              <label>Rol:</label>
              <select
                value={formData.usu_rol}
                onChange={(e) => setFormData({...formData, usu_rol: e.target.value})}
                required
              >
                <option value="registro">Registro</option>
                <option value="evaluador">Evaluador</option>
                <option value="analista">Analista</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.usu_activo}
                  onChange={(e) => setFormData({...formData, usu_activo: e.target.checked})}
                />
                Usuario Activo
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingUser ? '💾 Actualizar' : '➕ Crear'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="usuarios-table">
        <h3>📋 Lista de Usuarios</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.usu_id} className={!usuario.usu_activo ? 'inactive-user' : ''}>
                <td>{usuario.usu_id}</td>
                <td>{usuario.usu_nombre}</td>
                <td>{usuario.usu_correo}</td>
                <td>
                  <span className={`rol-badge rol-${usuario.usu_rol.toLowerCase()}`}>
                    {usuario.usu_rol}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${usuario.usu_activo ? 'active' : 'inactive'}`}>
                    {usuario.usu_activo ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(usuario)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className={`btn btn-sm ${usuario.usu_activo ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleActive(usuario)}
                    >
                      {usuario.usu_activo ? '🔒 Desactivar' : '🔓 Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {usuarios.length === 0 && (
          <p className="no-data">No hay usuarios registrados</p>
        )}
      </div>
    </div>
  );
};

export default UsuariosCRUD;
