import axios from 'axios';

const API_BASE_URL = 'https://localhost:7051/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registroService = {
  // Guardar registro de agua
  guardarRegistroAgua: async (registroData) => {
    try {
      console.log('Datos enviados al servidor:', registroData);
      const response = await api.post('/RegistroAgua', registroData);
      return response.data;
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      if (error.response?.data?.details) {
        throw new Error(`Error del servidor: ${error.response.data.details}`);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al guardar registro de agua: ${error.message}`);
    }
  },

  // Guardar registro ABA
  guardarRegistroAba: async (registroData) => {
    try {
      const response = await api.post('/RegistroAba', registroData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al guardar registro ABA: ${error.message}`);
    }
  },

  // Obtener registros de agua
  obtenerRegistrosAgua: async () => {
    try {
      const response = await api.get('/RegistroAgua');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener registros de agua: ${error.message}`);
    }
  },

  // Obtener registros ABA
  obtenerRegistrosAba: async () => {
    try {
      const response = await api.get('/RegistroAba');
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener registros ABA: ${error.message}`);
    }
  }
};
