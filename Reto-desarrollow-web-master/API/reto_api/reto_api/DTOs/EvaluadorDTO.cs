namespace reto_api.Dtos
{
    public class AsignarAnalistaDTO
    {
        public int AnalistaId { get; set; }
    }

    public class RechazarRegistroDTO
    {
        public string Motivo { get; set; } = string.Empty;
    }
}
