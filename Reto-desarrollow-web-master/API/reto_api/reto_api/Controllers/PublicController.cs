using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.Services;
using System.Net;

namespace reto_api.Controllers
{
    [ApiController]
    [Route("api/public")]
    [EnableCors("AllowPublicAccess")]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPdfService _pdfService;

        public PublicController(AppDbContext context, IPdfService pdfService)
        {
            _context = context;
            _pdfService = pdfService;
        }

        /// <summary>
        /// Valida un token y retorna información básica del registro asociado
        /// </summary>
        [HttpGet("validate-token/{token}")]
        public async Task<IActionResult> ValidateToken(string token)
        {
            try
            {
                // Buscar el token en la base de datos
                var tokenAcceso = await _context.TokensAcceso
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (tokenAcceso == null)
                {
                    return NotFound(new { message = "Token no encontrado", valid = false });
                }

                if (!tokenAcceso.EsValido())
                {
                    return BadRequest(new { 
                        message = tokenAcceso.FechaExpiracion < DateTime.Now ? "Token expirado" : "Token inactivo", 
                        valid = false 
                    });
                }

                // Obtener información básica del registro
                var infoRegistro = await ObtenerInfoRegistroAsync(tokenAcceso.RegistroId, tokenAcceso.TipoRegistro);
                
                if (infoRegistro == null)
                {
                    return NotFound(new { message = "Registro asociado no encontrado", valid = false });
                }

                // Actualizar estadísticas de acceso
                tokenAcceso.AccesosCount++;
                tokenAcceso.UltimoAcceso = DateTime.Now;
                tokenAcceso.IpUltimoAcceso = GetClientIpAddress();
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    valid = true,
                    token = token,
                    registroId = tokenAcceso.RegistroId,
                    tipoRegistro = tokenAcceso.TipoRegistro,
                    fechaCreacion = tokenAcceso.FechaCreacion,
                    fechaExpiracion = tokenAcceso.FechaExpiracion,
                    accesos = tokenAcceso.AccesosCount,
                    registro = infoRegistro
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene el PDF asociado a un token válido
        /// </summary>
        [HttpGet("pdf/{token}")]
        public async Task<IActionResult> GetPdfByToken(string token)
        {
            try
            {
                // Buscar y validar el token
                var tokenAcceso = await _context.TokensAcceso
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (tokenAcceso == null)
                {
                    return NotFound(new { message = "Token no encontrado" });
                }

                if (!tokenAcceso.EsValido())
                {
                    return BadRequest(new { 
                        message = tokenAcceso.FechaExpiracion < DateTime.Now ? "Token expirado" : "Token inactivo"
                    });
                }

                // Generar el PDF
                var pdfBytes = await _pdfService.GenerarPdfRegistroAsync(tokenAcceso.RegistroId, tokenAcceso.TipoRegistro);

                // Actualizar estadísticas de acceso
                tokenAcceso.AccesosCount++;
                tokenAcceso.UltimoAcceso = DateTime.Now;
                tokenAcceso.IpUltimoAcceso = GetClientIpAddress();
                await _context.SaveChangesAsync();

                // Retornar el PDF
                var fileName = $"Informe_{tokenAcceso.TipoRegistro}_{tokenAcceso.RegistroId}_{DateTime.Now:yyyyMMdd}.pdf";
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generando PDF", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint para verificar el estado del servicio público
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                status = "healthy", 
                timestamp = DateTime.Now,
                service = "Token Validation Service"
            });
        }

        /// <summary>
        /// Obtiene información básica del registro sin datos sensibles
        /// </summary>
        private async Task<object?> ObtenerInfoRegistroAsync(int registroId, string tipoRegistro)
        {
            if (tipoRegistro == "agua")
            {
                var registro = await _context.RegistrosAgua
                    .Include(r => r.UsuarioRegistro)
                    .Where(r => r.Id == registroId && r.Estado == "Aprobado")
                    .FirstOrDefaultAsync();

                if (registro == null) return null;

                return new
                {
                    id = registro.Id,
                    numMuestra = registro.NumMuestra,
                    tipoMuestra = registro.Muestra,
                    fechaRecepcion = registro.FechaRecepcion?.ToString("dd/MM/yyyy"),
                    solicitante = registro.EnviadaPor,
                    estado = registro.Estado,
                    aptoConsumo = registro.AptoConsumo
                };
            }
            else
            {
                var registro = await _context.RegistrosAba
                    .Include(r => r.UsuarioRegistro)
                    .Where(r => r.Id == registroId && r.Estado == "Aprobado")
                    .FirstOrDefaultAsync();

                if (registro == null) return null;

                return new
                {
                    id = registro.Id,
                    numMuestra = registro.NumMuestra,
                    tipoMuestra = registro.TipoMuestra,
                    fechaRecepcion = registro.FechaRecibo?.ToString("dd/MM/yyyy"),
                    solicitante = registro.NombreSolicitante,
                    estado = registro.Estado,
                    aptoConsumo = registro.AptoConsumo
                };
            }
        }

        /// <summary>
        /// Obtiene la dirección IP del cliente
        /// </summary>
        private string GetClientIpAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress;
            
            // Verificar si hay headers de proxy
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                if (!string.IsNullOrEmpty(forwardedFor))
                {
                    return forwardedFor.Split(',')[0].Trim();
                }
            }
            
            if (Request.Headers.ContainsKey("X-Real-IP"))
            {
                var realIp = Request.Headers["X-Real-IP"].FirstOrDefault();
                if (!string.IsNullOrEmpty(realIp))
                {
                    return realIp;
                }
            }

            return ipAddress?.ToString() ?? "Unknown";
        }
    }
}
