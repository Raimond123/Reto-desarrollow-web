using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace reto_api.Services
{
    public class TokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<TokenCleanupService> _logger;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(24); // Ejecutar cada 24 horas

        public TokenCleanupService(IServiceProvider serviceProvider, ILogger<TokenCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Servicio de limpieza de tokens iniciado");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
                        var tokensLimpiados = await tokenService.LimpiarTokensExpiradosAsync();
                        
                        if (tokensLimpiados > 0)
                        {
                            _logger.LogInformation($"Limpieza automática completada: {tokensLimpiados} tokens eliminados");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error durante la limpieza automática de tokens");
                }

                await Task.Delay(_cleanupInterval, stoppingToken);
            }

            _logger.LogInformation("Servicio de limpieza de tokens detenido");
        }
    }
}
