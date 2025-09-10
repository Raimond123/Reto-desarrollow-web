const API_BASE_URL = 'https://localhost:7051/api';

export const analistaService = {
  // Obtener registros asignados al analista
  async obtenerRegistrosAsignados(analistaId) {
    try {
      console.log(' Llamando endpoints con analistaId:', analistaId);
      
      const [aguaResponse, abaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/RegistroAgua/analista/${analistaId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/RegistroAba/analista/${analistaId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const aguaData = aguaResponse.ok ? await aguaResponse.json() : [];
      const abaData = abaResponse.ok ? await abaResponse.json() : [];

      return [...aguaData, ...abaData];
    } catch (error) {
      console.error('Error al obtener registros asignados:', error);
      throw error;
    }
  },

  // Guardar análisis de AGUA
  async guardarAnalisisAgua(registroId, analisisData) {
    try {
      const response = await fetch(`${API_BASE_URL}/RegistroAgua/${registroId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analisisData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al guardar análisis de agua: ${errorText}`);
      }

      // ✅ Manejar cuando el backend devuelve vacío (204 o 200 sin body)
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };

    } catch (error) {
      console.error('Error en guardarAnalisisAgua:', error);
      throw error;
    }
  },

  // Guardar análisis de ABA (si también lo necesitas)
  async guardarAnalisisAba(registroId, analisisData) {
    try {
      const response = await fetch(`${API_BASE_URL}/RegistroAba/${registroId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analisisData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al guardar análisis ABA: ${errorText}`);
      }

      return response.status === 204 ? { success: true } : await response.json();
    } catch (error) {
      console.error('Error en guardarAnalisisAba:', error);
      throw error;
    }
  },

  // Marcar registro como completado (estado a "Por Evaluar")
  async completarRegistro(registroId, tipoRegistro) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'RegistroAgua' : 'RegistroAba';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/completar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al completar registro');
      }

      return response.status === 204 ? { success: true } : await response.json();
    } catch (error) {
      console.error('Error al completar registro:', error);
      throw error;
    }
  }
};