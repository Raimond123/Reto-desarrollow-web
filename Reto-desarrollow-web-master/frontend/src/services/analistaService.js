const API_BASE_URL = 'https://localhost:7051/api';

export const analistaService = {
  // Obtener registros asignados al analista
  async obtenerRegistrosAsignados(analistaId) {
    try {
      const [aguaResponse, abaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/registroagua`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/registroaba`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const aguaData = await aguaResponse.json();
      const abaData = await abaResponse.json();

      // Filtrar solo los registros asignados a este analista
      const registrosAgua = aguaData
        .filter(r => r.usuIdAnalista === analistaId && r.estado === 'En Proceso')
        .map(r => ({ ...r, tipo: 'agua' }));
      
      const registrosAba = abaData
        .filter(r => r.usuIdAnalista === analistaId && r.estado === 'En Proceso')
        .map(r => ({ ...r, tipo: 'aba' }));

      return [...registrosAgua, ...registrosAba];
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
