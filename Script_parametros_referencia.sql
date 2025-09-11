-- Script para crear tabla de parámetros de referencia
-- Esta tabla contiene los límites de confianza para cada parámetro de análisis

CREATE TABLE parametros_referencia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    parametro NVARCHAR(100) NOT NULL,
    tipo_analisis NVARCHAR(50) NOT NULL, -- 'agua' o 'aba'
    limite_minimo DECIMAL(18,4) NULL,
    limite_maximo DECIMAL(18,4) NULL,
    valor_referencia NVARCHAR(100) NULL, -- Para valores como "Ausente", "Negativo", etc.
    unidad NVARCHAR(50) NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Insertar parámetros de referencia para AGUA
INSERT INTO parametros_referencia (parametro, tipo_analisis, limite_minimo, limite_maximo, valor_referencia, unidad) VALUES
-- Parámetros Fisicoquímicos - AGUA
('pH', 'agua', 6.5, 8.5, NULL, 'unidades de pH'),
('Sólidos Totales', 'agua', NULL, 500, NULL, 'mg/L'),
('Dureza', 'agua', NULL, NULL, 'Negativo', NULL),
('Cloro Residual', 'agua', 0.2, 1.0, NULL, 'mg/L'),
('Cloruro', 'agua', NULL, 250, NULL, 'mg/L'),
('Densidad', 'agua', 0.99, 1.01, NULL, 'g/mL'),

-- Parámetros Microbiológicos - AGUA
('Recuento de Microorganismos Aerobios Mesófilos', 'agua', NULL, 200, NULL, 'UFC/mL'),
('Recuento Coliformes', 'agua', NULL, 1, NULL, 'UFC/100 mL'),
('Coliformes Totales', 'agua', NULL, NULL, 'Ausente', NULL),
('E. Coli', 'agua', NULL, NULL, 'Ausente', NULL),
('Pseudomonas Spp', 'agua', NULL, NULL, 'Ausente', NULL),

-- Parámetros Fisicoquímicos - ABA (Alimentos, Bebidas y Afines)
('pH', 'aba', 3.0, 9.0, NULL, 'unidades de pH'),
('Acidez', 'aba', NULL, 5.0, NULL, '%'),
('Cenizas', 'aba', NULL, 10.0, NULL, '%'),
('Humedad', 'aba', NULL, 85.0, NULL, '%'),
('Materia Grasa (Cuantitativa)', 'aba', NULL, 30.0, NULL, '%'),
('Sólidos Totales', 'aba', 15.0, NULL, NULL, '%'),

-- Parámetros Microbiológicos - ABA
('Recuento de Microorganismos Aerobios Mesófilos', 'aba', NULL, 10000, NULL, 'UFC/g'),
('Recuento Coliformes', 'aba', NULL, 100, NULL, 'UFC/g'),
('Coliformes Totales', 'aba', NULL, 1000, NULL, 'UFC/g'),
('E. Coli', 'aba', NULL, 10, NULL, 'UFC/g'),
('Salmonella Spp', 'aba', NULL, NULL, 'Ausente', NULL),
('Estafilococos Aureus', 'aba', NULL, 100, NULL, 'UFC/g'),
('Hongos', 'aba', NULL, 1000, NULL, 'UFC/g'),
('Levaduras', 'aba', NULL, 1000, NULL, 'UFC/g'),
('Listeria Monocytogenes', 'aba', NULL, NULL, 'Ausente', NULL);

-- Crear índices para mejorar rendimiento
CREATE INDEX IX_parametros_referencia_tipo_parametro ON parametros_referencia(tipo_analisis, parametro);
CREATE INDEX IX_parametros_referencia_activo ON parametros_referencia(activo);
