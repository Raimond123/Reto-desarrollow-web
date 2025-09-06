using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace reto_api.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<RegistroAgua> RegistrosAgua { get; set; }
        public DbSet<RegistroAba> RegistrosAba { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relación de RegistroAgua con Usuario
            modelBuilder.Entity<RegistroAgua>()
                .HasOne(r => r.UsuarioRegistro)
                .WithMany()
                .HasForeignKey(r => r.UsuIdRegistro)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistroAgua>()
                .HasOne(r => r.UsuarioAnalista)
                .WithMany()
                .HasForeignKey(r => r.UsuIdAnalista)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistroAgua>()
                .HasOne(r => r.UsuarioEvaluador)
                .WithMany()
                .HasForeignKey(r => r.UsuIdEvaluador)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación de RegistroAba con Usuario
            modelBuilder.Entity<RegistroAba>()
                .HasOne(r => r.UsuarioRegistro)
                .WithMany()
                .HasForeignKey(r => r.UsuIdRegistro)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistroAba>()
                .HasOne(r => r.UsuarioAnalista)
                .WithMany()
                .HasForeignKey(r => r.UsuIdAnalista)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistroAba>()
                .HasOne(r => r.UsuarioEvaluador)
                .WithMany()
                .HasForeignKey(r => r.UsuIdEvaluador)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
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

        [Column("usu_activo")]
        public bool usu_activo { get; set; } = true;
    }

    [Table("REGISTRO_AGUA")]
    public class RegistroAgua
    {
        [Key]
        [Column("REG_AGUA_ID")]
        public int Id { get; set; }

        [Column("REG_AGUA_REGION_SALUD")] public string? RegionSalud { get; set; }
        [Column("REG_AGUA_DPTO_AREA")] public string? DptoArea { get; set; }
        [Column("REG_AGUA_TOMADA_POR")] public string? TomadaPor { get; set; }
        [Column("REG_AGUA_NUM_OFICIO")] public string? NumOficio { get; set; }
        [Column("REG_AGUA_NUM_MUESTRA")] public string? NumMuestra { get; set; }
        [Column("REG_AGUA_ENVIADA_POR")] public string? EnviadaPor { get; set; }
        [Column("REG_AGUA_MUESTRA")] public string? Muestra { get; set; }
        [Column("REG_AGUA_DIRECCION")] public string? Direccion { get; set; }
        [Column("REG_AGUA_CONDICION_MUESTRA")] public string? CondicionMuestra { get; set; }
        [Column("REG_AGUA_MOTIVO_SOLICITUD")] public string? MotivoSolicitud { get; set; }
        [Column("REG_AGUA_FECHA_TOMA")] public DateTime? FechaToma { get; set; }
        [Column("REG_AGUA_FECHA_RECEPCION")] public DateTime? FechaRecepcion { get; set; }
        [Column("REG_AGUA_CLORO_RESIDUAL")] public decimal? CloroResidual { get; set; }
        [Column("REG_AGUA_TEMPERATURA_AMBIENTE")] public decimal? TemperaturaAmbiente { get; set; }
        [Column("REG_AGUA_FECHA_REPORTE")] public DateTime? FechaReporte { get; set; }
        [Column("REG_AGUA_MICRORO_AEROBIOS")] public string? MicrooroAerobios { get; set; }
        [Column("REG_AGUA_PSEUDOMONAS_SPP")] public string? PseudomonasSPP { get; set; }
        [Column("REG_AGUA_METODOLOGIA_REFERENCIA")] public string? MetodologiaReferencia { get; set; }
        [Column("REG_AGUA_OBSERVACIONES")] public string? Observaciones { get; set; }
        [Column("REG_AGUA_TIPO_COPA")] public string? TipoCopa { get; set; }
        [Column("REG_AGUA_ESTADO")] public string? Estado { get; set; }

        // Relaciones con Usuario
        [ForeignKey("UsuarioRegistro")]
        [Column("USU_ID_REGISTRO")] public int UsuIdRegistro { get; set; }

        [ForeignKey("UsuarioAnalista")]
        [Column("USU_ID_ANALISTA")] public int? UsuIdAnalista { get; set; }

        [ForeignKey("UsuarioEvaluador")]
        [Column("USU_ID_EVALUADOR")] public int? UsuIdEvaluador { get; set; }

        public Usuario? UsuarioRegistro { get; set; }
        public Usuario? UsuarioAnalista { get; set; }
        public Usuario? UsuarioEvaluador { get; set; }
    }

    [Table("REGISTRO_ABA")]
    public class RegistroAba
    {
        [Key]
        [Column("REG_ABA_ID")]
        public int Id { get; set; }

        [Column("REG_ABA_NUM_OFICIO")] public string? NumOficio { get; set; }
        [Column("REG_ABA_FECHA_RECIBO")] public DateTime? FechaRecibo { get; set; }
        [Column("REG_ABA_NOMBRE_SOLICITANTE")] public string? NombreSolicitante { get; set; }
        [Column("REG_ABA_MOTIVO_SOLICITUD")] public string? MotivoSolicitud { get; set; }
        [Column("REG_ABA_TIPO_MUESTRA")] public string? TipoMuestra { get; set; }
        [Column("REG_ABA_CONDICION_RECEPCION")] public string? CondicionRecepcion { get; set; }
        [Column("REG_ABA_NUM_MUESTRA")] public string? NumMuestra { get; set; }
        [Column("REG_ABA_NUM_LOTE")] public string? NumLote { get; set; }
        [Column("REG_ABA_FECHA_ENTREGA")] public DateTime? FechaEntrega { get; set; }
        [Column("REG_ABA_COLOR")] public string? Color { get; set; }
        [Column("REG_ABA_OLOR")] public string? Olor { get; set; }
        [Column("REG_ABA_SABOR")] public string? Sabor { get; set; }
        [Column("REG_ABA_ASPECTO")] public string? Aspecto { get; set; }
        [Column("REG_ABA_TEXTURA")] public string? Textura { get; set; }
        [Column("REG_ABA_PESO_NETO")] public decimal? PesoNeto { get; set; }
        [Column("REG_ABA_FECHA_VENC")] public DateTime? FechaVencimiento { get; set; }
        [Column("REG_ABA_ACIDEZ")] public decimal? Acidez { get; set; }
        [Column("REG_ABA_CLORO_RESIDUAL")] public decimal? CloroResidual { get; set; }
        [Column("REG_ABA_CENIZAS")] public decimal? Cenizas { get; set; }
        [Column("REG_ABA_CUMARINA")] public string? Cumarina { get; set; }
        [Column("REG_ABA_CLORURO")] public decimal? Cloruro { get; set; }
        [Column("REG_ABA_DENSIDAD")] public decimal? Densidad { get; set; }
        [Column("REG_ABA_DUREZA")] public string? Dureza { get; set; }
        [Column("REG_ABA_EXTRACTO_SECO")] public string? ExtractoSeco { get; set; }
        [Column("REG_ABA_FECULA")] public string? Fecula { get; set; }
        [Column("REG_ABA_GRADO_ALCOHOLICO")] public decimal? GradoAlcoholico { get; set; }
        [Column("REG_ABA_HUMEDAD")] public decimal? Humedad { get; set; }
        [Column("REG_ABA_INDICE_REFACCION")] public decimal? IndiceRefaccion { get; set; }
        [Column("REG_ABA_INDICE_ACIDEZ")] public decimal? IndiceAcidez { get; set; }
        [Column("REG_ABA_INDICE_RANCIDEZ")] public decimal? IndiceRancidez { get; set; }
        [Column("REG_ABA_MATERIA_GRASA_CUALIT")] public string? MateriaGrasaCualit { get; set; }
        [Column("REG_ABA_MATERIA_GRASA_CUANTIT")] public decimal? MateriaGrasaCuantit { get; set; }
        [Column("REG_ABA_PH")] public decimal? PH { get; set; }
        [Column("REG_ABA_PRUEBA_EBER")] public string? PruebaEber { get; set; }
        [Column("REG_ABA_SOLIDOS_TOTALES")] public decimal? SolidosTotales { get; set; }
        [Column("REG_ABA_TIEMPO_COCCION")] public string? TiempoCoccion { get; set; }
        [Column("REG_ABA_OTRAS_DETERMINACIONES")] public string? OtrasDeterminaciones { get; set; }
        [Column("REG_ABA_REFERENCIA")] public string? Referencia { get; set; }
        [Column("REG_ABA_OBSERVACIONES")] public string? Observaciones { get; set; }
        [Column("REG_ABA_APTO_CONSUMO")] public bool? AptoConsumo { get; set; }
        [Column("REG_ABA_ESTADO")] public string? Estado { get; set; }

        // Relaciones
        [ForeignKey("UsuarioRegistro")]
        [Column("USU_ID_REGISTRO")] public int UsuIdRegistro { get; set; }

        [ForeignKey("UsuarioAnalista")]
        [Column("USU_ID_ANALISTA")] public int? UsuIdAnalista { get; set; }

        [ForeignKey("UsuarioEvaluador")]
        [Column("USU_ID_EVALUADOR")] public int? UsuIdEvaluador { get; set; }

        public Usuario UsuarioRegistro { get; set; }
        public Usuario? UsuarioAnalista { get; set; }
        public Usuario? UsuarioEvaluador { get; set; }
    }
}
