using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace reto_api.Models
{
    [Table("token_acceso")]
    public class TokenAcceso
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [Column("Token")]
        [StringLength(255)]
        public string Token { get; set; } = string.Empty;

        [Required]
        [Column("RegistroId")]
        public int RegistroId { get; set; }

        [Required]
        [Column("TipoRegistro")]
        [StringLength(10)]
        public string TipoRegistro { get; set; } = string.Empty; // "agua" o "aba"

        [Required]
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [Required]
        [Column("FechaExpiracion")]
        public DateTime FechaExpiracion { get; set; }

        [Required]
        [Column("Activo")]
        public bool Activo { get; set; } = true;

        [Column("AccesosCount")]
        public int AccesosCount { get; set; } = 0;

        [Column("UltimoAcceso")]
        public DateTime? UltimoAcceso { get; set; }

        [Column("IpUltimoAcceso")]
        [StringLength(45)]
        public string? IpUltimoAcceso { get; set; }

        // Método para verificar si el token está válido
        public bool EsValido()
        {
            return Activo && DateTime.Now <= FechaExpiracion;
        }

        // Método para generar un token único
        public static string GenerarTokenUnico()
        {
            return Guid.NewGuid().ToString("N").ToUpper();
        }

        // Método para crear un nuevo token con expiración por defecto (90 días)
        public static TokenAcceso CrearNuevo(int registroId, string tipoRegistro, int diasExpiracion = 90)
        {
            return new TokenAcceso
            {
                Token = GenerarTokenUnico(),
                RegistroId = registroId,
                TipoRegistro = tipoRegistro.ToLower(),
                FechaCreacion = DateTime.Now,
                FechaExpiracion = DateTime.Now.AddDays(diasExpiracion),
                Activo = true
            };
        }
    }
}
