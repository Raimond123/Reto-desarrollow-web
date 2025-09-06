-- Script para agregar la columna usu_activo a la tabla usuario
-- Ejecutar este script en SQL Server Management Studio

USE reto_desarrollo_web;

-- Agregar la columna usu_activo si no existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('usuario') AND name = 'usu_activo')
BEGIN
    ALTER TABLE usuario ADD usu_activo BIT NOT NULL DEFAULT 1;
    PRINT 'Columna usu_activo agregada exitosamente';
END
ELSE
BEGIN
    PRINT 'La columna usu_activo ya existe';
END

-- Actualizar todos los usuarios existentes para que estén activos por defecto
UPDATE usuario SET usu_activo = 1 WHERE usu_activo IS NULL;

PRINT 'Script ejecutado correctamente';
