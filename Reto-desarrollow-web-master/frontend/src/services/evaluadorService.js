const API_BASE_URL = 'https://localhost:7051/api';

export const evaluadorService = {
  // Obtener registros agrupados por estado
  async obtenerRegistrosPorEstado() {
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

      // Combinar y agrupar por estado
      const todosRegistros = [
        ...aguaData.map(r => ({ ...r, tipo: 'agua' })),
        ...abaData.map(r => ({ ...r, tipo: 'aba' }))
      ];

      return {
        porAsignar: todosRegistros.filter(r => r.estado === 'Por Asignar'),
        enProceso: todosRegistros.filter(r => r.estado === 'En Proceso'),
        porEvaluar: todosRegistros.filter(r => r.estado === 'Por Evaluar')
      };
    } catch (error) {
      console.error('Error al obtener registros:', error);
      throw error;
    }
  },

  // Obtener lista de analistas
  async obtenerAnalistas() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const usuarios = await response.json();
      return usuarios.filter(u => u.rol === 'Analista');
    } catch (error) {
      console.error('Error al obtener analistas:', error);
      throw error;
    }
  },

  // Asignar registro a analista
  async asignarAnalista(registroId, tipoRegistro, analistaId) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'registroagua' : 'registroaba';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/asignar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analistaId })
      });

      if (!response.ok) {
        throw new Error('Error al asignar analista');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al asignar analista:', error);
      throw error;
    }
  },

  // Aprobar registro
  async aprobarRegistro(registroId, tipoRegistro) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'registroagua' : 'registroaba';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar registro');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al aprobar registro:', error);
      throw error;
    }
  },

  // Rechazar registro
  async rechazarRegistro(registroId, tipoRegistro, motivo) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'registroagua' : 'registroaba';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/rechazar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar registro');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al rechazar registro:', error);
      throw error;
    }
  }
};
