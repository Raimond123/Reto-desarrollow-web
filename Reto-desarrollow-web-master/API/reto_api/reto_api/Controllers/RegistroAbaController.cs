using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.Dtos;

namespace reto_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistroAbaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistroAbaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RegistroAba
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRegistros()
        {
            var registros = await _context.RegistrosAba
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .ToListAsync();

            return registros.Select(r => new {
                r.Id,
                r.NumOficio,
                r.NombreSolicitante,
                r.FechaRecibo,
                r.TipoMuestra,
                r.CondicionRecepcion,
                r.NumMuestra,
                r.NumLote,
                r.FechaEntrega,
                r.Color,
                r.Olor,
                r.Sabor,
                r.Aspecto,
                r.Textura,
                r.PesoNeto,
                r.FechaVencimiento,
                r.Estado,
                r.Observaciones,
                r.UsuIdRegistro,
                r.UsuIdAnalista,
                r.UsuIdEvaluador,
                Analista = r.UsuarioAnalista != null ? r.UsuarioAnalista.usu_nombre : null
            }).ToList();
        }

        // GET: api/RegistroAba/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RegistroAba>> GetRegistro(int id)
        {
            var registro = await _context.RegistrosAba
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (registro == null)
                return NotFound();

            return registro;
        }

        // POST: api/RegistroAba
        [HttpPost]
        public async Task<ActionResult<RegistroAba>> PostRegistro(RegistroAbaDTO dto)
        {
            try
            {
                var registro = MapDTOToEntity(dto);

                _context.RegistrosAba.Add(registro);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRegistro), new { id = registro.Id }, registro);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Error al guardar el registro ABA",
                    details = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        // PUT: api/RegistroAba/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegistro(int id, RegistroAbaDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            UpdateEntityFromDTO(registro, dto);

            _context.Entry(registro).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.RegistrosAba.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/RegistroAba/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegistro(int id)
        {
            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            _context.RegistrosAba.Remove(registro);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/RegistroAba/5/asignar
        [HttpPut("{id}/asignar")]
        public async Task<IActionResult> AsignarAnalista(int id, [FromBody] AsignarAnalistaDTO dto)
        {
            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.UsuIdAnalista = dto.AnalistaId;
            registro.Estado = "En Proceso";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAba/5/aprobar
        [HttpPut("{id}/aprobar")]
        public async Task<IActionResult> AprobarRegistro(int id)
        {
            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Aprobado";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAba/5/rechazar
        [HttpPut("{id}/rechazar")]
        public async Task<IActionResult> RechazarRegistro(int id, [FromBody] RechazarRegistroDTO dto)
        {
            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Rechazado";
            registro.Observaciones = dto.Motivo;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAba/5/completar
        [HttpPut("{id}/completar")]
        public async Task<IActionResult> CompletarRegistro(int id)
        {
            var registro = await _context.RegistrosAba.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Por Evaluar";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/RegistroAba/analista/{analistaId}
        [HttpGet("analista/{analistaId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRegistrosPorAnalista(int analistaId)
        {
            if (analistaId <= 0)
            {
                return BadRequest("ID del analista no válido");
            }

            var registros = await _context.RegistrosAba
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .Where(r => r.UsuIdAnalista == analistaId && (r.Estado == "En Proceso" || r.Estado == "Rechazado"))
                .ToListAsync();

            return registros.Select(r => new {
                r.Id,
                r.NumOficio,
                r.NombreSolicitante,
                r.FechaRecibo,
                r.TipoMuestra,
                r.CondicionRecepcion,
                r.NumMuestra,
                r.NumLote,
                r.FechaEntrega,
                r.Color,
                r.Olor,
                r.Sabor,
                r.Aspecto,
                r.Textura,
                r.PesoNeto,
                r.FechaVencimiento,
                r.Estado,
                r.Observaciones,
                r.UsuIdRegistro,
                r.UsuIdAnalista,
                r.UsuIdEvaluador,
                Analista = r.UsuarioAnalista != null ? r.UsuarioAnalista.usu_nombre : null,
                Registro = r.UsuarioRegistro != null ? r.UsuarioRegistro.usu_nombre : null,
                Evaluador = r.UsuarioEvaluador != null ? r.UsuarioEvaluador.usu_nombre : null
            }).ToList();
        }

        // ===========================
        // Helpers para mapear el DTO
        // ===========================
        private RegistroAba MapDTOToEntity(RegistroAbaDTO dto)
        {
            var entity = new RegistroAba();
            UpdateEntityFromDTO(entity, dto);
            return entity;
        }

        private void UpdateEntityFromDTO(RegistroAba entity, RegistroAbaDTO dto)
        {
            entity.Id = dto.Id;
            entity.NumOficio = dto.NumOficio;
            entity.FechaRecibo = dto.FechaRecibo;
            entity.NombreSolicitante = dto.NombreSolicitante;
            entity.MotivoSolicitud = dto.MotivoSolicitud;
            entity.TipoMuestra = dto.TipoMuestra;
            entity.CondicionRecepcion = dto.CondicionRecepcion;
            entity.NumMuestra = dto.NumMuestra;
            entity.NumLote = dto.NumLote;
            entity.FechaEntrega = dto.FechaEntrega;
            entity.Color = dto.Color;
            entity.Olor = dto.Olor;
            entity.Sabor = dto.Sabor;
            entity.Aspecto = dto.Aspecto;
            entity.Textura = dto.Textura;
            entity.PesoNeto = dto.PesoNeto;
            entity.FechaVencimiento = dto.FechaVencimiento;
            entity.Acidez = dto.Acidez;
            entity.CloroResidual = dto.CloroResidual;
            entity.Cenizas = dto.Cenizas;
            entity.Cumarina = dto.Cumarina;
            entity.Cloruro = dto.Cloruro;
            entity.Densidad = dto.Densidad;
            entity.Dureza = dto.Dureza;
            entity.ExtractoSeco = dto.ExtractoSeco;
            entity.Fecula = dto.Fecula;
            entity.GradoAlcoholico = dto.GradoAlcoholico;
            entity.Humedad = dto.Humedad;
            entity.IndiceRefaccion = dto.IndiceRefaccion;
            entity.IndiceAcidez = dto.IndiceAcidez;
            entity.IndiceRancidez = dto.IndiceRancidez;
            entity.MateriaGrasaCualit = dto.MateriaGrasaCualit;
            entity.MateriaGrasaCuantit = dto.MateriaGrasaCuantit;
            entity.PH = dto.PH;
            entity.PruebaEber = dto.PruebaEber;
            entity.SolidosTotales = dto.SolidosTotales;
            entity.TiempoCoccion = dto.TiempoCoccion;
            entity.OtrasDeterminaciones = dto.OtrasDeterminaciones;
            entity.Referencia = dto.Referencia;
            entity.ResMicroorganismosAerobios = dto.ResMicroorganismosAerobios;
            entity.ResRecuentoColiformes = dto.ResRecuentoColiformes;
            entity.ResColiformesTotales = dto.ResColiformesTotales;
            entity.ResPseudomonasSpp = dto.ResPseudomonasSpp;
            entity.ResEColi = dto.ResEColi;
            entity.ResSalmonellaSpp = dto.ResSalmonellaSpp;
            entity.ResEstafilococosAureus = dto.ResEstafilococosAureus;
            entity.ResHongos = dto.ResHongos;
            entity.ResLevaduras = dto.ResLevaduras;
            entity.ResEsterilidadComercial = dto.ResEsterilidadComercial;
            entity.ResListeriaMonocytogenes = dto.ResListeriaMonocytogenes;
            entity.MetodologiaReferencia = dto.MetodologiaReferencia;
            entity.Equipos = dto.Equipos;
            entity.Observaciones = dto.Observaciones;
            entity.AptoConsumo = dto.AptoConsumo;
            entity.Estado = dto.Estado;
            entity.UsuIdRegistro = dto.UsuIdRegistro;
            entity.UsuIdAnalista = dto.UsuIdAnalista;
            entity.UsuIdEvaluador = dto.UsuIdEvaluador;
        }
    }
}
