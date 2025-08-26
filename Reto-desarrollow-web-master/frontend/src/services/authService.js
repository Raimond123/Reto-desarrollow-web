import axios from 'axios';

const API_BASE_URL = 'https://localhost:7051/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Login de usuario
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/auth/login', {
        correo,
        contrasena
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  },

  // Logout de usuario
  logout: async () => {
    try {
      await api.post('/auth/logout');
      return { success: true };
    } catch (error) {
      // Incluso si falla el logout del servidor, consideramos exitoso
      return { success: true };
    }
  }
};
