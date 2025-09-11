using Microsoft.AspNetCore.Mvc;
using reto_api.Services;

namespace reto_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public PdfController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        // GET: api/Pdf/registro/{id}/{tipo}
        [HttpGet("registro/{id}/{tipo}")]
        public async Task<IActionResult> GenerarPdfRegistro(int id, string tipo)
        {
            try
            {
                if (tipo != "agua" && tipo != "aba")
                {
                    return BadRequest("Tipo de registro debe ser 'agua' o 'aba'");
                }

                var pdfBytes = await _pdfService.GenerarPdfRegistroAsync(id, tipo);

                var fileName = $"Informe_Resultados_{tipo}_{id}_{DateTime.Now:yyyyMMdd}.pdf";

                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error al generar PDF",
                    details = ex.Message
                });
            }
        }

        // GET: api/Pdf/preview/{id}/{tipo} - Para vista previa en navegador
        [HttpGet("preview/{id}/{tipo}")]
        public async Task<IActionResult> PreviewPdfRegistro(int id, string tipo)
        {
            try
            {
                if (tipo != "agua" && tipo != "aba")
                {
                    return BadRequest("Tipo de registro debe ser 'agua' o 'aba'");
                }

                var pdfBytes = await _pdfService.GenerarPdfRegistroAsync(id, tipo);

                return File(pdfBytes, "application/pdf");
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error al generar PDF",
                    details = ex.Message
                });
            }
        }
    }
}
