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

  // Función para guardar registro ABA
  guardarRegistroAba: async (registroData) => {
    try {
      console.log('URL completa:', `${API_BASE_URL}/RegistroAba`);
      console.log('Datos enviados al servidor ABA:', registroData);
      const response = await api.post('/RegistroAba', registroData);
      return response.data;
    } catch (error) {
      console.error('Error al guardar registro ABA:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('URL intentada:', error.config?.url);
      if (error.response?.status === 400) {
        console.error('Error 400 - Datos inválidos:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Error al guardar el registro ABA');
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
