using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.Dtos;

namespace reto_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistroAguaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistroAguaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RegistroAgua
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRegistros()
        {
            var registros = await _context.RegistrosAgua
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .ToListAsync();

            return registros.Select(r => new
            {
                r.Id,
                r.RegionSalud,
                r.DptoArea,
                r.TomadaPor,
                r.NumOficio,
                r.NumMuestra,
                r.EnviadaPor,
                r.Muestra,
                r.Direccion,
                r.CondicionMuestra,
                r.MotivoSolicitud,
                r.FechaToma,
                r.FechaRecepcion,
                r.Color,
                r.Olor,
                r.Sabor,
                r.Aspecto,
                r.Textura,
                r.PesoNeto,
                r.FechaVencimiento,
                r.Acidez,
                r.CloroResidual,
                r.Cenizas,
                r.Cumarina,
                r.Cloruro,
                r.Densidad,
                r.Dureza,
                r.ExtractoSeco,
                r.Fecula,
                r.GradoAlcoholico,
                r.Humedad,
                r.IndiceRefaccion,
                r.IndiceAcidez,
                r.IndiceRancidez,
                r.MateriaGrasaCualit,
                r.MateriaGrasaCuantit,
                r.PH,
                r.PruebaEber,
                r.SolidosTotales,
                r.TiempoCoccion,
                r.OtrasDeterminaciones,
                r.Referencia,
                r.TemperaturaAmbiente,
                r.FechaReporte,
                r.MicrooroAerobios,
                r.PseudomonasSPP,
                r.MetodologiaReferencia,
                r.Observaciones,
                r.AptoConsumo,
                r.Estado,
                r.UsuIdRegistro,
                r.UsuIdAnalista,
                r.UsuIdEvaluador,
                Analista = r.UsuarioAnalista != null ? r.UsuarioAnalista.usu_nombre : null
            }).ToList();
        }

        // GET: api/RegistroAgua/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RegistroAgua>> GetRegistro(int id)
        {
            var registro = await _context.RegistrosAgua
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (registro == null)
                return NotFound();

            return registro;
        }

        // POST: api/RegistroAgua
        [HttpPost]
        public async Task<ActionResult<RegistroAgua>> PostRegistro(RegistroAguaDTO dto)
        {
            try
            {
                var registro = MapDTOToEntity(dto);

                _context.RegistrosAgua.Add(registro);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRegistro), new { id = registro.Id }, registro);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error interno del servidor",
                    details = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        // PUT: api/RegistroAgua/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegistro(int id, RegistroAguaDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var registro = await _context.RegistrosAgua.FindAsync(id);
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
                if (!_context.RegistrosAgua.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return Ok();
        }

        // PUT: api/RegistroAgua/5/asignar
        [HttpPut("{id}/asignar")]
        public async Task<IActionResult> AsignarAnalista(int id, [FromBody] AsignarAnalistaDTO dto)
        {
            var registro = await _context.RegistrosAgua.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.UsuIdAnalista = dto.AnalistaId;
            registro.Estado = "En Proceso";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAgua/5/aprobar
        [HttpPut("{id}/aprobar")]
        public async Task<IActionResult> AprobarRegistro(int id)
        {
            var registro = await _context.RegistrosAgua.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Aprobado";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAgua/5/rechazar
        [HttpPut("{id}/rechazar")]
        public async Task<IActionResult> RechazarRegistro(int id, [FromBody] RechazarRegistroDTO dto)
        {
            var registro = await _context.RegistrosAgua.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Rechazado";
            registro.Observaciones = dto.Motivo;

            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/RegistroAgua/5/completar
        [HttpPut("{id}/completar")]
        public async Task<IActionResult> CompletarRegistro(int id)
        {
            var registro = await _context.RegistrosAgua.FindAsync(id);
            if (registro == null)
                return NotFound();

            registro.Estado = "Por Evaluar";

            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/RegistroAgua/analista/{analistaId}
        [HttpGet("analista/{analistaId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRegistrosPorAnalista(int analistaId)
        {
            if (analistaId <= 0)
            {
                return BadRequest("ID del analista no válido");
            }

            var registros = await _context.RegistrosAgua
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .Where(r => r.UsuIdAnalista == analistaId && r.Estado == "En Proceso")
                .ToListAsync();

            return registros.Select(r => new
            {
                r.Id,
                r.RegionSalud,
                r.DptoArea,
                r.TomadaPor,
                r.NumOficio,
                r.NumMuestra,
                r.EnviadaPor,
                r.Muestra,
                r.Direccion,
                r.CondicionMuestra,
                r.MotivoSolicitud,
                r.FechaToma,
                r.FechaRecepcion,
                r.CloroResidual,
                r.Estado,
                r.Observaciones,
                r.UsuIdRegistro,
                r.UsuIdAnalista,
                r.UsuIdEvaluador,
                Tipo = "agua"
            }).ToList();
        }

        // 🔹 Helpers
        private RegistroAgua MapDTOToEntity(RegistroAguaDTO dto)
        {
            return new RegistroAgua
            {
                Id = dto.Id,
                RegionSalud = dto.RegionSalud,
                DptoArea = dto.DptoArea,
                TomadaPor = dto.TomadaPor,
                NumOficio = dto.NumOficio,
                NumMuestra = dto.NumMuestra,
                EnviadaPor = dto.EnviadaPor,
                Muestra = dto.Muestra,
                Direccion = dto.Direccion,
                CondicionMuestra = dto.CondicionMuestra,
                MotivoSolicitud = dto.MotivoSolicitud,
                FechaToma = dto.FechaToma,
                FechaRecepcion = dto.FechaRecepcion,
                Color = dto.Color,
                Olor = dto.Olor,
                Sabor = dto.Sabor,
                Aspecto = dto.Aspecto,
                Textura = dto.Textura,
                PesoNeto = dto.PesoNeto,
                FechaVencimiento = dto.FechaVencimiento,
                Acidez = dto.Acidez,
                CloroResidual = dto.CloroResidual,
                Cenizas = dto.Cenizas,
                Cumarina = dto.Cumarina,
                Cloruro = dto.Cloruro,
                Densidad = dto.Densidad,
                Dureza = dto.Dureza,
                ExtractoSeco = dto.ExtractoSeco,
                Fecula = dto.Fecula,
                GradoAlcoholico = dto.GradoAlcoholico,
                Humedad = dto.Humedad,
                IndiceRefaccion = dto.IndiceRefaccion,
                IndiceAcidez = dto.IndiceAcidez,
                IndiceRancidez = dto.IndiceRancidez,
                MateriaGrasaCualit = dto.MateriaGrasaCualit,
                MateriaGrasaCuantit = dto.MateriaGrasaCuantit,
                PH = dto.PH,
                PruebaEber = dto.PruebaEber,
                SolidosTotales = dto.SolidosTotales,
                TiempoCoccion = dto.TiempoCoccion,
                OtrasDeterminaciones = dto.OtrasDeterminaciones,
                Referencia = dto.Referencia,
                TemperaturaAmbiente = dto.TemperaturaAmbiente,
                FechaReporte = dto.FechaReporte,
                MicrooroAerobios = dto.MicrooroAerobios,
                PseudomonasSPP = dto.PseudomonasSPP,
                MetodologiaReferencia = dto.MetodologiaReferencia,
                Observaciones = dto.Observaciones,
                AptoConsumo = dto.AptoConsumo,
                Estado = dto.Estado ?? "Por Asignar",

                UsuIdRegistro = dto.UsuIdRegistro,
                UsuIdAnalista = dto.UsuIdAnalista,
                UsuIdEvaluador = dto.UsuIdEvaluador
            };
        }

        private void UpdateEntityFromDTO(RegistroAgua entity, RegistroAguaDTO dto)
        {
            entity.RegionSalud = dto.RegionSalud;
            entity.DptoArea = dto.DptoArea;
            entity.TomadaPor = dto.TomadaPor;
            entity.NumOficio = dto.NumOficio;
            entity.NumMuestra = dto.NumMuestra;
            entity.EnviadaPor = dto.EnviadaPor;
            entity.Muestra = dto.Muestra;
            entity.Direccion = dto.Direccion;
            entity.CondicionMuestra = dto.CondicionMuestra;
            entity.MotivoSolicitud = dto.MotivoSolicitud;
            entity.FechaToma = dto.FechaToma;
            entity.FechaRecepcion = dto.FechaRecepcion;
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
            entity.TemperaturaAmbiente = dto.TemperaturaAmbiente;
            entity.FechaReporte = dto.FechaReporte;
            entity.MicrooroAerobios = dto.MicrooroAerobios;
            entity.PseudomonasSPP = dto.PseudomonasSPP;
            entity.MetodologiaReferencia = dto.MetodologiaReferencia;
            entity.Observaciones = dto.Observaciones;
            entity.AptoConsumo = dto.AptoConsumo;
            entity.Estado = dto.Estado;
        }
    }
}