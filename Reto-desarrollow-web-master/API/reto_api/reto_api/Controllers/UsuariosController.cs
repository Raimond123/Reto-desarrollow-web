using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.DTOs;
using System.Security.Cryptography;
using System.Text;
//using UsuariosApi.Data;
//using UsuariosApi.Models;

namespace reto_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsuariosController(AppDbContext context) => _context = context;

        // GET: api/usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> Get() =>
            await _context.Usuarios.AsNoTracking().ToListAsync();

        // GET: api/usuarios/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Usuario>> GetbGetById(int id)
        {
            var user = await _context.Usuarios.FindAsync(id);
            return user is null ? NotFound() : user;
        }

        // POST: api/usuarios
        [HttpPost]
        public async Task<ActionResult<Usuario>> Post(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = usuario.usu_id }, usuario);
        }

        // PUT: api/usuarios/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateUsuarioDTO updateDto)
        {
            var existingUser = await _context.Usuarios.FindAsync(id);
            if (existingUser == null) return NotFound();

            // Actualizar solo los campos proporcionados
            if (!string.IsNullOrEmpty(updateDto.usu_nombre))
                existingUser.usu_nombre = updateDto.usu_nombre;
            
            if (!string.IsNullOrEmpty(updateDto.usu_correo))
                existingUser.usu_correo = updateDto.usu_correo;
            
            if (!string.IsNullOrEmpty(updateDto.usu_rol))
                existingUser.usu_rol = updateDto.usu_rol;
            
            // Solo actualizar contraseña si se proporciona una nueva
            if (!string.IsNullOrEmpty(updateDto.usu_contrasena))
                existingUser.usu_contrasena = updateDto.usu_contrasena;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/usuarios/5/toggle-active
        [HttpPut("{id:int}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id, [FromBody] ToggleActiveDTO dto)
        {
            var user = await _context.Usuarios.FindAsync(id);
            if (user is null) return NotFound();

            user.usu_activo = dto.Activo;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, activo = user.usu_activo });
        }

        // DELETE: api/usuarios/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Usuarios.FindAsync(id);
            if (user is null) return NotFound();

            _context.Usuarios.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/usuarios/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO loginRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Buscar usuario por correo
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.usu_correo == loginRequest.Correo);

            if (usuario == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            // Verificar si el usuario está activo
            if (!usuario.usu_activo)
                return Unauthorized(new { message = "Usuario desactivado. Contacte al administrador." });

            // Verificar contraseña (en un escenario real, deberías usar hash)
            if (usuario.usu_contrasena != loginRequest.Contrasena)
                return Unauthorized(new { message = "Credenciales inválidas" });

            // Generar token simple (en producción usar JWT)
            var token = GenerateSimpleToken(usuario.usu_id);

            var response = new LoginResponseDTO
            {
                UsuarioId = usuario.usu_id,
                Nombre = usuario.usu_nombre,
                Correo = usuario.usu_correo,
                Rol = usuario.usu_rol,
                Token = token,
                FechaLogin = DateTime.Now
            };

            return Ok(response);
        }

        // POST: api/usuarios/logout
        [HttpPost("logout")]
        public async Task<ActionResult<LogoutResponseDTO>> Logout(LogoutRequestDTO logoutRequest)
        {
            // Verificar que el usuario existe
            var usuario = await _context.Usuarios.FindAsync(logoutRequest.UsuarioId);
            
            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // En un escenario real, aquí invalidarías el token JWT
            // Por ahora, simplemente retornamos una respuesta exitosa
            var response = new LogoutResponseDTO
            {
                Success = true,
                Message = "Logout exitoso",
                FechaLogout = DateTime.Now
            };

            return Ok(response);
        }

        // Método auxiliar para generar token simple
        private string GenerateSimpleToken(int userId)
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var tokenData = $"{userId}:{timestamp}";
            
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(tokenData));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
