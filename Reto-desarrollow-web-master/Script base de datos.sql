
create database reto_desarrollo_web;
use reto_desarrollo_web;

CREATE TABLE usuario (
    usu_id INT PRIMARY KEY IDENTITY(1,1),
    usu_nombre NVARCHAR(100) NOT NULL,
    usu_correo NVARCHAR(150) NOT NULL UNIQUE,
    usu_contrasena NVARCHAR(255) NOT NULL,
    usu_rol NVARCHAR(50) NOT NULL
);

