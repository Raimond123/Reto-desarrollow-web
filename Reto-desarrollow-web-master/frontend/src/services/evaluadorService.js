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

      // Combinar y agregar tipo
      const todosRegistros = [
        ...aguaData.map(r => ({ ...r, tipo: 'agua' })),
        ...abaData.map(r => ({ ...r, tipo: 'aba' }))
      ];

      // 🔹 Agrupar también los rechazados
      return {
        porAsignar: todosRegistros.filter(r => r.estado === 'Por Asignar'),
        enProceso: todosRegistros.filter(r => r.estado === 'En Proceso'),
        porEvaluar: todosRegistros.filter(r => r.estado === 'Por Evaluar'),
        rechazados: todosRegistros.filter(r => r.estado === 'Rechazado') // 👈 añadido
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
      console.log("📌 Respuesta cruda de /usuarios:", usuarios);

      // Normalizar para aceptar rol y usu_rol
      return usuarios
        .filter(u => (u.usu_rol || u.rol || '').toLowerCase() === 'analista')
        .map(u => ({
          usuarioId: u.usu_id || u.id,
          nombre: u.usu_nombre || u.nombre,
          correo: u.usu_correo || u.correo
        }));
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
        body: JSON.stringify({ analistaId: parseInt(analistaId, 10) })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend devolvió error:", errorText);
        throw new Error(`Error al asignar analista -> ${errorText}`);
      }

      if (response.status === 204) {
        return { success: true };
      }

      try {
        return await response.json();
      } catch {
        return { success: true };
      }
    } catch (error) {
      console.error('Error al asignar analista:', error);
      throw error;
    }
  },

  // Aprobar registro
  aprobarRegistro: async (registroId, tipoRegistro) => {
    const endpoint = tipoRegistro === 'agua' ? 'RegistroAgua' : 'RegistroAba';
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/aprobar`, {
      method: 'PUT'
    });

    if (!response.ok) {
      throw new Error('Error al aprobar registro');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  // Rechazar registro
  rechazarRegistro: async (registroId, tipoRegistro, motivo) => {
    const endpoint = tipoRegistro === 'agua' ? 'RegistroAgua' : 'RegistroAba';
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${registroId}/rechazar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motivo })
    });

    if (!response.ok) {
      throw new Error('Error al rechazar registro');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return { success: true };
    }
  }
};
