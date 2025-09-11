# Sistema de Interoperabilidad con Tokens - DIGEMAPS

## Descripción General

Este sistema permite que los clientes consulten los resultados de sus análisis de laboratorio desde una página web externa utilizando tokens únicos, proporcionando interoperabilidad entre el sistema interno y aplicaciones externas.

## Arquitectura del Sistema

### Componentes Principales

1. **Backend API (.NET Core)**
   - `TokenAcceso.cs` - Modelo de datos para tokens
   - `TokenService.cs` - Lógica de negocio para tokens
   - `PublicController.cs` - Endpoints públicos para validación
   - `PdfController.cs` - Generación de PDFs con tokens

2. **Base de Datos**
   - Tabla `token_acceso` - Almacena tokens únicos con metadatos

3. **Página Web Externa**
   - `index.html` - Interfaz de consulta para clientes
   - `app.js` - Lógica de frontend para validación

## Flujo de Funcionamiento

### 1. Generación de Token
```
Registro Aprobado → Generar PDF → Crear Token → Entregar a Cliente
```

### 2. Consulta Externa
```
Cliente ingresa Token → Validar Token → Mostrar Resultados → Descargar PDF
```

## Endpoints de la API

### Endpoints Internos (Autenticados)
- `POST /api/Pdf/generar-con-token/{id}/{tipo}` - Genera token para registro

### Endpoints Públicos (Sin autenticación)
- `GET /api/public/validate-token/{token}` - Valida token y retorna info básica
- `GET /api/public/pdf/{token}` - Descarga PDF usando token
- `GET /api/public/health` - Estado del servicio

## Configuración

### 1. Base de Datos
Ejecutar el script SQL:
```sql
-- Ubicación: Script_tabla_tokens.sql
CREATE TABLE [dbo].[token_acceso] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Token] NVARCHAR(255) NOT NULL UNIQUE,
    [RegistroId] INT NOT NULL,
    [TipoRegistro] NVARCHAR(10) NOT NULL,
    [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [FechaExpiracion] DATETIME2 NOT NULL,
    [Activo] BIT NOT NULL DEFAULT 1,
    [AccesosCount] INT NOT NULL DEFAULT 0,
    [UltimoAcceso] DATETIME2 NULL,
    [IpUltimoAcceso] NVARCHAR(45) NULL
);
```

### 2. Backend
Los servicios ya están configurados en `Program.cs`:
```csharp
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddHostedService<TokenCleanupService>();
```

### 3. Página Externa
Configurar la URL de la API en `app.js`:
```javascript
const API_BASE_URL = 'https://localhost:7051/api/public';
```

## Uso del Sistema

### Para Administradores del Sistema

1. **Generar Token para un Registro:**
```http
POST /api/Pdf/generar-con-token/123/agua
```

Respuesta:
```json
{
    "success": true,
    "token": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
    "registroId": 123,
    "tipoRegistro": "agua",
    "urlConsulta": "/api/public/validate-token/A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6"
}
```

### Para Clientes Externos

1. **Abrir la página de consulta:** `pagina-externa-tokens/index.html`
2. **Ingresar el token** recibido del laboratorio
3. **Ver resultados** y descargar PDF

## Características de Seguridad

### Tokens
- **Únicos:** Cada token es un GUID de 32 caracteres
- **Expiración:** 90 días por defecto
- **Revocables:** Pueden desactivarse manualmente
- **Rastreables:** Se registran accesos e IPs

### Validaciones
- Solo registros con estado "Aprobado" pueden generar tokens
- Tokens expirados se rechazan automáticamente
- Limpieza automática cada 24 horas

### CORS
- Endpoints públicos permiten acceso desde cualquier origen
- Endpoints internos restringidos al frontend autorizado

## Monitoreo y Logs

El sistema registra:
- Generación de nuevos tokens
- Validaciones exitosas y fallidas
- Descargas de PDFs
- Limpieza automática de tokens

## Ejemplo de Integración

### Generar Token (Backend)
```csharp
var tokenService = serviceProvider.GetService<ITokenService>();
var token = await tokenService.GenerarTokenParaRegistroAsync(registroId, "agua");
```

### Validar Token (JavaScript)
```javascript
const response = await fetch(`${API_BASE_URL}/validate-token/${token}`);
const data = await response.json();
if (data.valid) {
    // Mostrar resultados
}
```

## Mantenimiento

### Limpieza Manual de Tokens
```sql
EXEC LimpiarTokensExpirados;
```

### Revocar Token Específico
```http
PUT /api/tokens/revoke/{token}
```

## Troubleshooting

### Problemas Comunes

1. **Token no encontrado**
   - Verificar que el token esté escrito correctamente
   - Confirmar que no haya expirado

2. **Error de CORS**
   - Verificar configuración en `Program.cs`
   - Confirmar que la URL de la API sea correcta

3. **PDF no se genera**
   - Verificar que el registro esté en estado "Aprobado"
   - Revisar logs del servidor

### Logs Importantes
```
TokenService: Token generado para registro {id}
TokenService: Token validado exitosamente
TokenCleanupService: {n} tokens limpiados
```

## Próximas Mejoras

- Rate limiting para endpoints públicos
- Notificaciones por email con tokens
- Dashboard de administración de tokens
- Integración con códigos QR
- API webhooks para notificaciones
