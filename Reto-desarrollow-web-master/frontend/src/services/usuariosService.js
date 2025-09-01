import axios from 'axios';

const API_BASE_URL = 'https://localhost:7051/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usuariosService = {
  // Obtener todos los usuarios
  obtenerUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  },

  // Obtener usuario por ID
  obtenerUsuarioPorId: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  },

  // Crear nuevo usuario
  crearUsuario: async (usuario) => {
    try {
      const response = await api.post('/usuarios', usuario);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  },

  // Actualizar usuario
  actualizarUsuario: async (id, usuario) => {
    try {
      await api.put(`/usuarios/${id}`, { ...usuario, usu_id: id });
      return { success: true };
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  },

  // Eliminar usuario
  eliminarUsuario: async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  },

  // Login de usuario
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/usuarios/login', {
        correo: correo,
        contrasena: contrasena
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  },

  // Logout de usuario
  logout: async (usuarioId) => {
    try {
      const response = await api.post('/usuarios/logout', {
        usuarioId: usuarioId
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }
};
