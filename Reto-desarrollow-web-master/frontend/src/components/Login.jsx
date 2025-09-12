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
        id: response.usuarioId,            // 👈 ahora se incluye el id
        nombre: response.nombre,
        correo: response.correo,
        rol: response.rol
      };
      console.log(userData);

      login(userData, response.token); // cache/context guarda todo
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">🧪</div>
              <h1>DIGEMAPS</h1>
              <p className="subtitle">Dirección General de Medicamentos, Alimentos y Productos Sanitarios</p>
            </div>
            <p className="login-description">Sistema de Gestión de Análisis de Laboratorio</p>
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
            <div className="roles-info">
              <h4>🔬 Roles del Sistema</h4>
              <div className="roles-grid">
                <div className="role-item">
                  <span className="role-icon">👨‍🔬</span>
                  <span>Evaluador</span>
                </div>
                <div className="role-item">
                  <span className="role-icon">🧪</span>
                  <span>Analista</span>
                </div>
                <div className="role-item">
                  <span className="role-icon">📋</span>
                  <span>Registro</span>
                </div>
              </div>
            </div>
            <div className="lab-info">
              <p>🏢 Laboratorio Certificado ISO 17025</p>
              <p>🔒 Acceso Seguro y Confidencial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
