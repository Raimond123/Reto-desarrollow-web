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
        public async Task<ActionResult<IEnumerable<RegistroAgua>>> GetRegistros()
        {
            return await _context.RegistrosAgua
                .Include(r => r.UsuarioRegistro)
                .Include(r => r.UsuarioAnalista)
                .Include(r => r.UsuarioEvaluador)
                .ToListAsync();
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
            var registro = MapDTOToEntity(dto);

            _context.RegistrosAgua.Add(registro);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRegistro), new { id = registro.Id }, registro);
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

            // Actualizamos con el DTO
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

            return NoContent();
        }

        // 🔹 Helpers para mapear entre DTO y Entidad
        private RegistroAgua MapDTOToEntity(RegistroAguaDTO dto)
        {
            return new RegistroAgua
            {
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

                // Nuevos campos
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
                Estado = dto.Estado,

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

            // Nuevos campos
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

            entity.UsuIdRegistro = dto.UsuIdRegistro;
            entity.UsuIdAnalista = dto.UsuIdAnalista;
            entity.UsuIdEvaluador = dto.UsuIdEvaluador;
        }
    }
}