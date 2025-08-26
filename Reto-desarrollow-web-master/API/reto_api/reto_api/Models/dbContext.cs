using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace reto_api.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
    }

    [Table("usuario")]
    public class Usuario
    {
        [Key]
        [Column("usu_id")]
        public int usu_id { get; set; }

        [Required, MaxLength(100)]
        [Column("usu_nombre")]
        public string usu_nombre { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        [Column("usu_correo")]
        public string usu_correo { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        [Column("usu_contrasena")]
        public string usu_contrasena { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        [Column("usu_rol")]
        public string usu_rol { get; set; } = string.Empty;
    }
}
