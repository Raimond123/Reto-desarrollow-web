-- Script para crear tabla de tokens de acceso
-- Esta tabla almacenará los tokens únicos generados para cada PDF

USE [reto_db]
GO

-- Crear tabla token_acceso
CREATE TABLE [dbo].[token_acceso] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Token] NVARCHAR(255) NOT NULL UNIQUE,
    [RegistroId] INT NOT NULL,
    [TipoRegistro] NVARCHAR(10) NOT NULL, -- 'agua' o 'aba'
    [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [FechaExpiracion] DATETIME2 NOT NULL,
    [Activo] BIT NOT NULL DEFAULT 1,
    [AccesosCount] INT NOT NULL DEFAULT 0,
    [UltimoAcceso] DATETIME2 NULL,
    [IpUltimoAcceso] NVARCHAR(45) NULL
);

-- Crear índices para optimizar consultas
CREATE INDEX IX_token_acceso_Token ON [dbo].[token_acceso] ([Token]);
CREATE INDEX IX_token_acceso_RegistroId_Tipo ON [dbo].[token_acceso] ([RegistroId], [TipoRegistro]);
CREATE INDEX IX_token_acceso_FechaExpiracion ON [dbo].[token_acceso] ([FechaExpiracion]);

-- Agregar restricciones de clave foránea (opcional, dependiendo de si quieres mantener integridad referencial)
-- ALTER TABLE [dbo].[token_acceso] 
-- ADD CONSTRAINT FK_token_acceso_RegistroAgua 
-- FOREIGN KEY ([RegistroId]) REFERENCES [dbo].[registro_agua]([Id]);

-- ALTER TABLE [dbo].[token_acceso] 
-- ADD CONSTRAINT FK_token_acceso_RegistroAba 
-- FOREIGN KEY ([RegistroId]) REFERENCES [dbo].[registro_aba]([Id]);

-- Procedimiento para limpiar tokens expirados (ejecutar periódicamente)
CREATE PROCEDURE [dbo].[LimpiarTokensExpirados]
AS
BEGIN
    DELETE FROM [dbo].[token_acceso] 
    WHERE [FechaExpiracion] < GETDATE() OR [Activo] = 0;
END
GO

PRINT 'Tabla token_acceso creada exitosamente';
