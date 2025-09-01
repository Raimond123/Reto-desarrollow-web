-- Script para insertar usuarios de prueba en la base de datos
USE reto_desarrollo_web;

-- Verificar usuarios existentes
SELECT * FROM usuario;

-- Insertar usuarios de prueba para cada rol
INSERT INTO usuario (usu_nombre, usu_correo, usu_contrasena, usu_rol) VALUES
('Usuario Registro', 'registro@test.com', '123456', 'Registro'),
('Usuario Evaluador', 'evaluador@test.com', '123456', 'Evaluador'),
('Usuario Analista', 'analista@test.com', '123456', 'Analista');

-- Verificar que se insertaron correctamente
SELECT usu_id, usu_nombre, usu_correo, usu_rol FROM usuario;

-- Verificar IDs específicos para usar en el frontend
SELECT 'ID para Registro: ' + CAST(usu_id AS VARCHAR) AS info FROM usuario WHERE usu_correo = 'registro@test.com';
SELECT 'ID para Evaluador: ' + CAST(usu_id AS VARCHAR) AS info FROM usuario WHERE usu_correo = 'evaluador@test.com';
SELECT 'ID para Analista: ' + CAST(usu_id AS VARCHAR) AS info FROM usuario WHERE usu_correo = 'analista@test.com';
