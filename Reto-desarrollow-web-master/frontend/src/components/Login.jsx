import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

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
      const response = await authService.login(formData.correo, formData.contrasena);
      
      const userData = {
        nombre: response.nombre,
        correo: response.correo,
        rol: response.rol
      };

      login(userData, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Sistema de Gestión</h1>
            <p>Acceso al Sistema</p>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="form-control"
                value={formData.correo}
                onChange={handleChange}
                required
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña:</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                className="form-control"
                value={formData.contrasena}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-info">
            <p><strong>Roles disponibles:</strong> Evaluador, Analista, Registro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
