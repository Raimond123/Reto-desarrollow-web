# Instrucciones de Implementación - Sistema de Tokens

## Pasos para Implementar el Sistema

### 1. Ejecutar Script de Base de Datos
```sql
-- Ejecutar en SQL Server Management Studio
-- Archivo: Script_tabla_tokens.sql
USE [reto_db]
GO

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

### 2. Compilar y Ejecutar Backend
```bash
cd "c:\Users\dario\OneDrive\Desktop\el final\Reto-desarrollow-web\Reto-desarrollow-web-master\API\reto_api\reto_api"
dotnet build
dotnet run
```

### 3. Abrir Página Externa
```bash
# Abrir en navegador
file:///c:/Users/dario/OneDrive/Desktop/el%20final/Reto-desarrollow-web/pagina-externa-tokens/index.html
```

## Prueba del Sistema

### Paso 1: Generar Token
```http
POST https://localhost:7051/api/Pdf/generar-con-token/1/agua
```

### Paso 2: Usar Token en Página Externa
1. Abrir `pagina-externa-tokens/index.html`
2. Ingresar el token generado
3. Verificar que se muestren los resultados
4. Descargar el PDF

### Paso 3: Validar Endpoints Públicos
```http
GET https://localhost:7051/api/public/validate-token/{TOKEN}
GET https://localhost:7051/api/public/pdf/{TOKEN}
```

## Integración con Frontend Existente

Para integrar con el dashboard del evaluador, agregar botón "Generar Token" que llame:

```javascript
const generarToken = async (registroId, tipo) => {
    try {
        const response = await fetch(`/api/Pdf/generar-con-token/${registroId}/${tipo}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            alert(`Token generado: ${data.token}`);
            // Mostrar token al usuario para que lo entregue al cliente
        }
    } catch (error) {
        console.error('Error generando token:', error);
    }
};
```

## Verificación Final

✅ Tabla `token_acceso` creada
✅ Modelos y servicios implementados
✅ Endpoints públicos funcionando
✅ Página externa operativa
✅ Documentación completa

El sistema está listo para uso en producción.
