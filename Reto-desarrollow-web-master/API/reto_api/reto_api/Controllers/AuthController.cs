using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.Services;

namespace reto_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            // Buscar usuario por correo
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.usu_correo == request.Correo);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            // Verificar contraseña (en producción usar hash)
            if (usuario.usu_contrasena != request.Contrasena)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            // Verificar que el rol sea válido
            var rolesValidos = new[] { "evaluador", "analista", "registro" };
            if (!rolesValidos.Contains(usuario.usu_rol))
            {
                return Unauthorized(new { message = "Rol no autorizado para acceder al sistema." });
            }

            // Generar token JWT
            var token = _jwtService.GenerateToken(usuario);
            var expiration = DateTime.UtcNow.AddMinutes(60);

            var response = new LoginResponse
            {
                Token = token,
                Nombre = usuario.usu_nombre,
                Correo = usuario.usu_correo,
                Rol = usuario.usu_rol,
                Expiration = expiration
            };

            return Ok(response);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // En JWT no hay logout del lado del servidor
            // El cliente debe eliminar el token
            return Ok(new { message = "Logout exitoso" });
        }
    }
}
