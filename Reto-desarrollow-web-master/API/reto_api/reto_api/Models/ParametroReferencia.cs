using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace reto_api.Models
{
    [Table("parametros_referencia")]
    public class ParametroReferencia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Parametro { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("tipo_analisis")]
        public string TipoAnalisis { get; set; } = string.Empty; // 'agua' o 'aba'

        [Column("limite_minimo")]
        public decimal? LimiteMinimo { get; set; }

        [Column("limite_maximo")]
        public decimal? LimiteMaximo { get; set; }

        [MaxLength(100)]
        [Column("valor_referencia")]
        public string? ValorReferencia { get; set; } // Para valores como "Ausente", "Negativo"

        [MaxLength(50)]
        public string? Unidad { get; set; }

        public bool Activo { get; set; } = true;

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
