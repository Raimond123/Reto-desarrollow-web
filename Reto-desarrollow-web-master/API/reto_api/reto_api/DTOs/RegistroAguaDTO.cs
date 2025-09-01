namespace reto_api.Dtos
{
    public class RegistroAguaDTO
    {
        public int Id { get; set; }

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
        public decimal? CloroResidual { get; set; }
        public decimal? TemperaturaAmbiente { get; set; }
        public DateTime? FechaReporte { get; set; }
        public string? MicrooroAerobios { get; set; }
        public string? PseudomonasSPP { get; set; }
        public string? MetodologiaReferencia { get; set; }
        public string? Observaciones { get; set; }
        public string? TipoCopa { get; set; }
        public string? Estado { get; set; }

        // IDs de usuario (solo enviamos los ID)
        public int UsuIdRegistro { get; set; }   // requerido
        public int? UsuIdAnalista { get; set; }  // opcional
        public int? UsuIdEvaluador { get; set; } // opcional
    }
}