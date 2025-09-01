namespace reto_api.Dtos
{
    public class RegistroAbaDTO
    {
        public int Id { get; set; }
        public string? NumOficio { get; set; }
        public DateTime? FechaRecibo { get; set; }
        public string? NombreSolicitante { get; set; }
        public string? MotivoSolicitud { get; set; }
        public string? TipoMuestra { get; set; }
        public string? CondicionRecepcion { get; set; }
        public string? NumMuestra { get; set; }
        public string? NumLote { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string? Color { get; set; }
        public string? Olor { get; set; }
        public string? Sabor { get; set; }
        public string? Aspecto { get; set; }
        public string? Textura { get; set; }
        public decimal? PesoNeto { get; set; }
        public DateTime? FechaVencimiento { get; set; }
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
        public string? Observaciones { get; set; }
        public bool? AptoConsumo { get; set; }
        public string? Estado { get; set; }

        // Solo IDs de usuario
        public int UsuIdRegistro { get; set; }    // Obligatorio
        public int? UsuIdAnalista { get; set; }   // Opcional
        public int? UsuIdEvaluador { get; set; }  // Opcional
    }
}