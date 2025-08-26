import React, { useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';

const FormularioUsuario = ({ usuario, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    usu_nombre: '',
    usu_correo: '',
    usu_contrasena: '',
    usu_rol: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormData({
        usu_nombre: usuario.usu_nombre || '',
        usu_correo: usuario.usu_correo || '',
        usu_contrasena: '', // No mostrar contraseña existente
        usu_rol: usuario.usu_rol || ''
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (usuario) {
        // Editar usuario existente
        await usuariosService.actualizarUsuario(usuario.usu_id, formData);
      } else {
        // Crear nuevo usuario
        await usuariosService.crearUsuario(formData);
      }
      onGuardar();
      // Limpiar formulario si es nuevo usuario
      if (!usuario) {
        setFormData({
          usu_nombre: '',
          usu_correo: '',
          usu_contrasena: '',
          usu_rol: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="usu_nombre">Nombre:</label>
          <input
            type="text"
            id="usu_nombre"
            name="usu_nombre"
            className="form-control"
            value={formData.usu_nombre}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="usu_correo">Correo:</label>
          <input
            type="email"
            id="usu_correo"
            name="usu_correo"
            className="form-control"
            value={formData.usu_correo}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </div>

        <div className="form-group">
          <label htmlFor="usu_contrasena">
            {usuario ? 'Nueva Contraseña (dejar vacío para mantener actual):' : 'Contraseña:'}
          </label>
          <input
            type="password"
            id="usu_contrasena"
            name="usu_contrasena"
            className="form-control"
            value={formData.usu_contrasena}
            onChange={handleChange}
            required={!usuario}
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="usu_rol">Rol:</label>
          <select
            id="usu_rol"
            name="usu_rol"
            className="form-control"
            value={formData.usu_rol}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="analista">Analista</option>
            <option value="evaluador">Evaluador</option>
            <option value="registro">Registro</option>
          </select>
        </div>

        <div>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (usuario ? 'Actualizar' : 'Crear')}
          </button>
          {usuario && (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioUsuario;
