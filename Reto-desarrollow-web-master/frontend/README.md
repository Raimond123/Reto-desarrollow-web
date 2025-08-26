# Frontend - Sistema de Gestión de Usuarios

Este es el frontend en React para el sistema de gestión de usuarios que se conecta con la API .NET Core.

## Características

- **CRUD completo de usuarios**: Crear, leer, actualizar y eliminar usuarios
- **Interfaz moderna**: UI responsive con estilos CSS modernos
- **Validación de formularios**: Validación del lado del cliente
- **Manejo de errores**: Mensajes de error y estados de carga
- **Comunicación con API**: Integración completa con la API REST

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── ListaUsuarios.jsx     # Componente para mostrar lista de usuarios
│   │   └── FormularioUsuario.jsx # Componente para crear/editar usuarios
│   ├── services/
│   │   └── usuariosService.js    # Servicio para comunicación con API
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Estilos globales
├── package.json
├── vite.config.js
└── index.html
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar la API:**
   - Asegúrate de que la API .NET Core esté ejecutándose en `https://localhost:7000`
   - Si la API usa un puerto diferente, actualiza la URL en `src/services/usuariosService.js`

3. **Ejecutar el proyecto:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   - El frontend estará disponible en `http://localhost:3000`

## Funcionalidades Implementadas

### 📋 Lista de Usuarios
- Muestra todos los usuarios en una tabla
- Botones para editar y eliminar cada usuario
- Actualización automática después de operaciones CRUD

### ➕ Crear Usuario
- Formulario para agregar nuevos usuarios
- Campos: nombre, correo, contraseña, rol
- Validación de campos requeridos

### ✏️ Editar Usuario
- Formulario pre-poblado con datos del usuario
- Opción de cambiar contraseña (opcional)
- Botón cancelar para volver a la vista normal

### 🗑️ Eliminar Usuario
- Confirmación antes de eliminar
- Actualización automática de la lista

## Configuración de la API

El frontend está configurado para conectarse a:
- **URL Base**: `https://localhost:7000/api`
- **Endpoints utilizados**:
  - `GET /usuarios` - Obtener todos los usuarios
  - `GET /usuarios/{id}` - Obtener usuario por ID
  - `POST /usuarios` - Crear nuevo usuario
  - `PUT /usuarios/{id}` - Actualizar usuario
  - `DELETE /usuarios/{id}` - Eliminar usuario

## Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Herramienta de build y desarrollo
- **Axios** - Cliente HTTP para comunicación con API
- **CSS3** - Estilos modernos y responsive

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecutar linter

## Notas Importantes

1. **CORS**: Asegúrate de que la API tenga configurado CORS para permitir requests desde `http://localhost:3000`

2. **HTTPS**: La API debe estar ejecutándose con HTTPS. Si tienes problemas de certificados, puedes configurar el navegador para aceptar certificados auto-firmados.

3. **Base de Datos**: Asegúrate de que la base de datos SQL Server esté ejecutándose y que la tabla `usuario` esté creada usando el script SQL proporcionado.

## Próximos Pasos

- Agregar autenticación y autorización
- Implementar paginación para listas grandes
- Agregar filtros y búsqueda
- Mejorar la validación del lado del cliente
- Agregar tests unitarios
