const API_BASE_URL = 'https://localhost:7051/api';

export const analistaService = {
  // Obtener registros asignados al analista (incluye En Proceso y Rechazados)
  async obtenerRegistrosAsignados(analistaId) {
    try {
      console.log('📋 Llamando endpoints con analistaId:', analistaId);
      
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

      // Mapear los registros para agregar el tipo y ordenar por estado
      const registrosAgua = aguaData.map(r => ({ ...r, tipo: 'agua' }));
      const registrosAba = abaData.map(r => ({ ...r, tipo: 'aba' }));
      
      // Combinar y ordenar: primero los rechazados, luego en proceso
      const todosRegistros = [...registrosAgua, ...registrosAba];
      
      // Ordenar para que los rechazados aparezcan primero
      return todosRegistros.sort((a, b) => {
        if (a.estado === 'Rechazado' && b.estado !== 'Rechazado') return -1;
        if (a.estado !== 'Rechazado' && b.estado === 'Rechazado') return 1;
        return 0;
      });

    } catch (error) {
      console.error('Error al obtener registros asignados:', error);
      throw error;
    }
  },

  // Obtener un registro específico por ID (para cargar datos completos)
  async obtenerRegistroPorId(registroId, tipoRegistro) {
    try {
      const endpoint = tipoRegistro === 'agua' ? 'RegistroAgua' : 'RegistroAba';
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener registro: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener registro por ID:', error);
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

  // Guardar análisis de ABA
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

      // Manejar respuesta vacía
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
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

      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.error('Error al completar registro:', error);
      throw error;
    }
  },

  // Obtener estadísticas del analista
  async obtenerEstadisticasAnalista(analistaId) {
    try {
      const registros = await this.obtenerRegistrosAsignados(analistaId);
      
      return {
        totalAsignados: registros.length,
        enProceso: registros.filter(r => r.estado === 'En Proceso').length,
        rechazados: registros.filter(r => r.estado === 'Rechazado').length,
        agua: registros.filter(r => r.tipo === 'agua').length,
        aba: registros.filter(r => r.tipo === 'aba').length
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalAsignados: 0,
        enProceso: 0,
        rechazados: 0,
        agua: 0,
        aba: 0
      };
    }
  }
};