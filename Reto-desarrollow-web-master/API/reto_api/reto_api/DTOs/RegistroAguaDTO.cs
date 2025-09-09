namespace reto_api.Dtos
{
    public class RegistroAguaDTO
    {
        public int Id { get; set; }

        // Datos generales
        public string? RegionSalud { get; set; }
        public string? DptoArea { get; set; }
        public string? TomadaPor { get; set; }
        public string? NumOficio { get; set; }
        public string? NumMuestra { get; set; }
        public string? EnviadaPor { get; set; }
        public string? Muestra { get; set; }
        public string? Direccion { get; set; }
        public string? CondicionMuestra { get; set; }
        public string? MotivoSolicitud { get; set; }

        public DateTime? FechaToma { get; set; }
        public DateTime? FechaRecepcion { get; set; }

        // Organolépticos
        public string? Color { get; set; }
        public string? Olor { get; set; }
        public string? Sabor { get; set; }
        public string? Aspecto { get; set; }
        public string? Textura { get; set; }

        public decimal? PesoNeto { get; set; }
        public DateTime? FechaVencimiento { get; set; }

        // Fisico-químicos
        public decimal? Acidez { get; set; }
        public decimal? CloroResidual { get; set; }
        public decimal? Cenizas { get; set; }
        public string? Cumarina { get; set; }
        public decimal? Cloruro { get; set; }
        public decimal? Densidad { get; set; }
        public string? Dureza { get; set; }
        public string? ExtractoSeco { get; set; }
        public string? Fecula { get; set; }
        public decimal? GradoAlcoholico { get; set; }
        public decimal? Humedad { get; set; }
        public decimal? IndiceRefaccion { get; set; }
        public decimal? IndiceAcidez { get; set; }
        public decimal? IndiceRancidez { get; set; }
        public string? MateriaGrasaCualit { get; set; }
        public decimal? MateriaGrasaCuantit { get; set; }
        public decimal? PH { get; set; }
        public string? PruebaEber { get; set; }
        public decimal? SolidosTotales { get; set; }
        public string? TiempoCoccion { get; set; }

        public string? OtrasDeterminaciones { get; set; }
        public string? Referencia { get; set; }
        public decimal? TemperaturaAmbiente { get; set; }

        public DateTime? FechaReporte { get; set; }

        // 🔬 Microbiológicos
        public string? ResMicroorganismosAerobios { get; set; }
        public string? ResRecuentoColiformes { get; set; }
        public string? ResColiformesTotales { get; set; }
        public string? ResPseudomonasSpp { get; set; }
        public string? ResEColi { get; set; }
        public string? ResSalmonellaSpp { get; set; }
        public string? ResEstafilococosAureus { get; set; }
        public string? ResHongos { get; set; }
        public string? ResLevaduras { get; set; }
        public string? ResEsterilidadComercial { get; set; }
        public string? ResListeriaMonocytogenes { get; set; }
        public string? MetodologiaReferencia { get; set; }
        public string? Equipos { get; set; }

        // Observaciones/Estado
        public string? Observaciones { get; set; }
        public bool? AptoConsumo { get; set; }
        public string? Estado { get; set; }

        // Usuarios
        public int UsuIdRegistro { get; set; }   // required
        public int? UsuIdAnalista { get; set; }  // optional
        public int? UsuIdEvaluador { get; set; } // optional
    }
}