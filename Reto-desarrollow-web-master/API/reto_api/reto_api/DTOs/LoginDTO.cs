using System.ComponentModel.DataAnnotations;

namespace reto_api.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required]
        public string Contrasena { get; set; } = string.Empty;
    }

    public class LoginResponseDTO
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime FechaLogin { get; set; }
    }

    public class LogoutRequestDTO
    {
        public int UsuarioId { get; set; }
    }

    public class LogoutResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime FechaLogout { get; set; }
    }
}
