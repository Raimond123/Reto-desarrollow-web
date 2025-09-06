const API_BASE_URL = 'https://localhost:7051/api';

export const analistaService = {
  // Obtener registros asignados al analista
  async obtenerRegistrosAsignados(analistaId) {
    try {
      console.log('🔍 Llamando endpoints con analistaId:', analistaId);
      
      const [aguaResponse, abaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/registroagua/analista/${analistaId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/registroaba/analista/${analistaId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      console.log('📡 Respuesta agua:', aguaResponse.status);
      console.log('📡 Respuesta aba:', abaResponse.status);

      if (!aguaResponse.ok) {
        console.error('❌ Error en agua:', await aguaResponse.text());
      }
      if (!abaResponse.ok) {
        console.error('❌ Error en aba:', await abaResponse.text());
      }

      const aguaData = aguaResponse.ok ? await aguaResponse.json() : [];
      const abaData = abaResponse.ok ? await abaResponse.json() : [];

      console.log('📊 Datos agua:', aguaData);
      console.log('📊 Datos aba:', abaData);

      return [...aguaData, ...abaData];
    } catch (error) {
      console.error('Error al obtener registros asignados:', error);
      throw error;
    }
  },

  // Marcar registro como completado
  async completarRegistro(registroId, tipoRegistro) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'registroagua' : 'registroaba';
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

      return await response.json();
    } catch (error) {
      console.error('Error al completar registro:', error);
      throw error;
    }
  }
};
