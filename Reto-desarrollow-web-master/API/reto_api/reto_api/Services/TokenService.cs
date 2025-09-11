using Microsoft.EntityFrameworkCore;
using reto_api.Models;

namespace reto_api.Services
{
    public interface ITokenService
    {
        Task<string> GenerarTokenParaRegistroAsync(int registroId, string tipoRegistro);
        Task<TokenAcceso?> ValidarTokenAsync(string token);
        Task<bool> RevocarTokenAsync(string token);
        Task<int> LimpiarTokensExpiradosAsync();
        Task<List<TokenAcceso>> ObtenerTokensActivosAsync(int registroId, string tipoRegistro);
    }

    public class TokenService : ITokenService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TokenService> _logger;

        public TokenService(AppDbContext context, ILogger<TokenService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<string> GenerarTokenParaRegistroAsync(int registroId, string tipoRegistro)
        {
            try
            {
                // Verificar que el registro existe y está aprobado
                var registroExiste = await VerificarRegistroAprobadoAsync(registroId, tipoRegistro);
                if (!registroExiste)
                {
                    throw new ArgumentException("Registro no encontrado o no aprobado");
                }

                // Verificar si ya existe un token activo
                var tokenExistente = await _context.TokensAcceso
                    .FirstOrDefaultAsync(t => t.RegistroId == registroId && 
                                            t.TipoRegistro == tipoRegistro.ToLower() && 
                                            t.Activo && 
                                            t.FechaExpiracion > DateTime.Now);

                if (tokenExistente != null)
                {
                    _logger.LogInformation($"Token existente reutilizado para registro {registroId} tipo {tipoRegistro}");
                    return tokenExistente.Token;
                }

                // Crear nuevo token
                var nuevoToken = TokenAcceso.CrearNuevo(registroId, tipoRegistro);
                
                _context.TokensAcceso.Add(nuevoToken);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Nuevo token generado para registro {registroId} tipo {tipoRegistro}");
                return nuevoToken.Token;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generando token para registro {registroId} tipo {tipoRegistro}");
                throw;
            }
        }

        public async Task<TokenAcceso?> ValidarTokenAsync(string token)
        {
            try
            {
                var tokenAcceso = await _context.TokensAcceso
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (tokenAcceso == null)
                {
                    _logger.LogWarning($"Token no encontrado: {token}");
                    return null;
                }

                if (!tokenAcceso.EsValido())
                {
                    _logger.LogWarning($"Token inválido o expirado: {token}");
                    return null;
                }

                return tokenAcceso;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error validando token: {token}");
                return null;
            }
        }

        public async Task<bool> RevocarTokenAsync(string token)
        {
            try
            {
                var tokenAcceso = await _context.TokensAcceso
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (tokenAcceso == null)
                {
                    return false;
                }

                tokenAcceso.Activo = false;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Token revocado: {token}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error revocando token: {token}");
                return false;
            }
        }

        public async Task<int> LimpiarTokensExpiradosAsync()
        {
            try
            {
                var tokensExpirados = await _context.TokensAcceso
                    .Where(t => t.FechaExpiracion < DateTime.Now || !t.Activo)
                    .ToListAsync();

                if (tokensExpirados.Any())
                {
                    _context.TokensAcceso.RemoveRange(tokensExpirados);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation($"Limpiados {tokensExpirados.Count} tokens expirados");
                }

                return tokensExpirados.Count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error limpiando tokens expirados");
                return 0;
            }
        }

        public async Task<List<TokenAcceso>> ObtenerTokensActivosAsync(int registroId, string tipoRegistro)
        {
            try
            {
                return await _context.TokensAcceso
                    .Where(t => t.RegistroId == registroId && 
                              t.TipoRegistro == tipoRegistro.ToLower() && 
                              t.Activo && 
                              t.FechaExpiracion > DateTime.Now)
                    .OrderByDescending(t => t.FechaCreacion)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error obteniendo tokens activos para registro {registroId}");
                return new List<TokenAcceso>();
            }
        }

        private async Task<bool> VerificarRegistroAprobadoAsync(int registroId, string tipoRegistro)
        {
            if (tipoRegistro.ToLower() == "agua")
            {
                return await _context.RegistrosAgua
                    .AnyAsync(r => r.Id == registroId && r.Estado == "Aprobado");
            }
            else
            {
                return await _context.RegistrosAba
                    .AnyAsync(r => r.Id == registroId && r.Estado == "Aprobado");
            }
        }
    }
}
