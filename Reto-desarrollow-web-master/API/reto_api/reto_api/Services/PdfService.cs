using iTextSharp.text;
using iTextSharp.text.pdf;
using reto_api.Models;
using Microsoft.EntityFrameworkCore;

namespace reto_api.Services
{
    public interface IPdfService
    {
        Task<byte[]> GenerarPdfRegistroAsync(int registroId, string tipoRegistro);
        Task<string> GenerarPdfConTokenAsync(int registroId, string tipoRegistro);
    }

    public class PdfService : IPdfService
    {
        private readonly AppDbContext _context;

        public PdfService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> GenerarPdfRegistroAsync(int registroId, string tipoRegistro)
        {
            // Obtener datos del registro
            var datosRegistro = await ObtenerDatosRegistroAsync(registroId, tipoRegistro);
            if (datosRegistro == null)
                throw new ArgumentException("Registro no encontrado");

            // Generar PDF usando iTextSharp
            using var memoryStream = new MemoryStream();
            var document = new Document(PageSize.A4, 36, 36, 36, 36);
            var writer = PdfWriter.GetInstance(document, memoryStream);
            
            document.Open();

            // Agregar contenido básico al PDF
            AgregarContenidoPdf(document, datosRegistro, tipoRegistro);

            document.Close();
            return memoryStream.ToArray();
        }

        public async Task<string> GenerarPdfConTokenAsync(int registroId, string tipoRegistro)
        {
            // Verificar que el registro existe y está aprobado
            var datosRegistro = await ObtenerDatosRegistroAsync(registroId, tipoRegistro);
            if (datosRegistro == null)
                throw new ArgumentException("Registro no encontrado o no aprobado");

            // Verificar si ya existe un token activo para este registro
            var tokenExistente = await _context.TokensAcceso
                .FirstOrDefaultAsync(t => t.RegistroId == registroId && 
                                        t.TipoRegistro == tipoRegistro.ToLower() && 
                                        t.Activo && 
                                        t.FechaExpiracion > DateTime.Now);

            if (tokenExistente != null)
            {
                return tokenExistente.Token;
            }

            // Crear nuevo token
            var nuevoToken = TokenAcceso.CrearNuevo(registroId, tipoRegistro);
            
            // Guardar en base de datos
            _context.TokensAcceso.Add(nuevoToken);
            await _context.SaveChangesAsync();

            return nuevoToken.Token;
        }

        private async Task<dynamic?> ObtenerDatosRegistroAsync(int registroId, string tipoRegistro)
        {
            if (tipoRegistro == "agua")
            {
                return await _context.RegistrosAgua
                    .Include(r => r.UsuarioRegistro)
                    .Include(r => r.UsuarioAnalista)
                    .Include(r => r.UsuarioEvaluador)
                    .Where(r => r.Id == registroId && r.Estado == "Aprobado")
                    .FirstOrDefaultAsync();
            }
            else
            {
                return await _context.RegistrosAba
                    .Include(r => r.UsuarioRegistro)
                    .Include(r => r.UsuarioAnalista)
                    .Include(r => r.UsuarioEvaluador)
                    .Where(r => r.Id == registroId && r.Estado == "Aprobado")
                    .FirstOrDefaultAsync();
            }
        }

        private void AgregarContenidoPdf(Document document, dynamic registro, string tipoRegistro)
        {
            // Fuentes
            var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
            var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 11);
            var normalFont = FontFactory.GetFont(FontFactory.HELVETICA, 9);
            var smallFont = FontFactory.GetFont(FontFactory.HELVETICA, 8);

            // Encabezado institucional
            AgregarEncabezado(document, titleFont, normalFont, smallFont);

            // Información básica del registro
            AgregarInformacionBasica(document, registro, tipoRegistro, normalFont, headerFont);

            // Características organolépticas
            AgregarCaracteristicasOrganolépticas(document, registro, normalFont, headerFont);

            // Análisis Fisicoquímicos
            AgregarAnalisisFisicoquimicos(document, registro, tipoRegistro, normalFont, headerFont);

            // Análisis Microbiológicos
            AgregarAnalisisMicrobiologicos(document, registro, tipoRegistro, normalFont, headerFont);

            // Metodologías y observaciones
            AgregarMetodologiasYObservaciones(document, registro, tipoRegistro, normalFont, headerFont);

            // Conclusión y firmas
            AgregarConclusionYFirmas(document, registro, normalFont, headerFont);
        }

        private void AgregarEncabezado(Document document, Font titleFont, Font normalFont, Font smallFont)
        {
            // Título institucional
            var institucion = new Paragraph("Dirección General de Medicamentos, Alimentos y Productos Sanitarios (DIGEMAPS)", titleFont);
            institucion.Alignment = Element.ALIGN_CENTER;
            document.Add(institucion);

            var laboratorio = new Paragraph("Laboratorio de Evaluación de Productos de Consumo Humano (LEPCH)", normalFont);
            laboratorio.Alignment = Element.ALIGN_CENTER;
            document.Add(laboratorio);

            var digemaps = new Paragraph("DIGEMAPS", normalFont);
            digemaps.Alignment = Element.ALIGN_CENTER;
            document.Add(digemaps);

            var labAnalisis = new Paragraph("Laboratorio de Análisis de Alimentos y Bebidas", normalFont);
            labAnalisis.Alignment = Element.ALIGN_CENTER;
            document.Add(labAnalisis);

            document.Add(new Paragraph(" ", normalFont));

            var tituloInforme = new Paragraph("INFORME DE RESULTADOS", titleFont);
            tituloInforme.Alignment = Element.ALIGN_CENTER;
            tituloInforme.SpacingAfter = 15f;
            document.Add(tituloInforme);
        }

        private void AgregarInformacionBasica(Document document, dynamic registro, string tipoRegistro, Font normalFont, Font headerFont)
        {
            var table = new PdfPTable(4);
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 25f, 25f, 25f, 25f });

            // Fila 1
            AgregarCeldaTabla(table, "Número de Trámite", normalFont, true);
            AgregarCeldaTabla(table, registro.Id?.ToString() ?? "-", normalFont, false);
            AgregarCeldaTabla(table, "Número de Muestra", normalFont, true);
            AgregarCeldaTabla(table, registro.NumMuestra?.ToString() ?? "-", normalFont, false);

            // Fila 2
            AgregarCeldaTabla(table, "Fecha de Recibo", normalFont, true);
            var fechaRecibo = tipoRegistro == "agua" ? 
                (registro.FechaRecepcion?.ToString("dd/MM/yyyy") ?? "-") : 
                (registro.FechaRecibo?.ToString("dd/MM/yyyy") ?? "-");
            AgregarCeldaTabla(table, fechaRecibo, normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);

            // Fila 3
            AgregarCeldaTabla(table, "Nombre del Solicitante", normalFont, true);
            var solicitante = tipoRegistro == "agua" ? 
                (registro.EnviadaPor ?? "-") : 
                (registro.NombreSolicitante ?? "-");
            var celdaSolicitante = new PdfPCell(new Phrase(solicitante, normalFont));
            celdaSolicitante.Colspan = 3;
            celdaSolicitante.Border = Rectangle.BOX;
            table.AddCell(celdaSolicitante);

            // Fila 4 - Dirección/Razón Social
            if (tipoRegistro == "agua")
            {
                AgregarCeldaTabla(table, "Dirección", normalFont, true);
                var celdaDireccion = new PdfPCell(new Phrase(registro.Direccion ?? "-", normalFont));
                celdaDireccion.Colspan = 3;
                celdaDireccion.Border = Rectangle.BOX;
                table.AddCell(celdaDireccion);

                AgregarCeldaTabla(table, "Razón Social", normalFont, true);
                var celdaRazon = new PdfPCell(new Phrase(registro.RegionSalud ?? "-", normalFont));
                celdaRazon.Colspan = 3;
                celdaRazon.Border = Rectangle.BOX;
                table.AddCell(celdaRazon);
            }

            // Fila 5 - Motivo de solicitud
            AgregarCeldaTabla(table, "Motivo de la Solicitud", normalFont, true);
            var celdaMotivo = new PdfPCell(new Phrase(registro.MotivoSolicitud ?? "-", normalFont));
            celdaMotivo.Colspan = 3;
            celdaMotivo.Border = Rectangle.BOX;
            table.AddCell(celdaMotivo);

            // Fila 6 - Tipo y condición de muestra
            AgregarCeldaTabla(table, "Tipo de Muestra", normalFont, true);
            var tipoMuestra = tipoRegistro == "agua" ? 
                (registro.Muestra ?? "-") : 
                (registro.TipoMuestra ?? "-");
            AgregarCeldaTabla(table, tipoMuestra, normalFont, false);
            AgregarCeldaTabla(table, "Cond. de la Muestra", normalFont, true);
            var condicionMuestra = tipoRegistro == "agua" ? 
                (registro.CondicionMuestra ?? "-") : 
                (registro.CondicionRecepcion ?? "-");
            AgregarCeldaTabla(table, condicionMuestra, normalFont, false);

            document.Add(table);
            document.Add(new Paragraph(" ", normalFont));
        }

        private void AgregarCaracteristicasOrganolépticas(Document document, dynamic registro, Font normalFont, Font headerFont)
        {
            var table = new PdfPTable(6);
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 15f, 20f, 15f, 20f, 15f, 15f });

            // Fila de características organolépticas
            AgregarCeldaTabla(table, "Color:", normalFont, true);
            AgregarCeldaTabla(table, registro.Color ?? "Propio del Producto", normalFont, false);
            AgregarCeldaTabla(table, "Olor:", normalFont, true);
            AgregarCeldaTabla(table, registro.Olor ?? "Propio del Producto", normalFont, false);
            AgregarCeldaTabla(table, "Sabor:", normalFont, true);
            AgregarCeldaTabla(table, registro.Sabor ?? "Propio del Producto", normalFont, false);

            AgregarCeldaTabla(table, "Aspecto:", normalFont, true);
            AgregarCeldaTabla(table, registro.Aspecto ?? "-", normalFont, false);
            AgregarCeldaTabla(table, "Textura:", normalFont, true);
            AgregarCeldaTabla(table, registro.Textura ?? "-", normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);

            AgregarCeldaTabla(table, "Peso Neto:", normalFont, true);
            AgregarCeldaTabla(table, registro.PesoNeto?.ToString() ?? "-", normalFont, false);
            AgregarCeldaTabla(table, "Fecha Vence:", normalFont, true);
            AgregarCeldaTabla(table, registro.FechaVencimiento?.ToString("dd/MM/yyyy") ?? "-", normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);
            AgregarCeldaTabla(table, "", normalFont, false);

            document.Add(table);
            document.Add(new Paragraph(" ", normalFont));
        }

        private void AgregarAnalisisFisicoquimicos(Document document, dynamic registro, string tipoRegistro, Font normalFont, Font headerFont)
        {
            var table = new PdfPTable(3);
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 50f, 25f, 25f });

            // Encabezado
            var headerCell1 = new PdfPCell(new Phrase("Análisis Fisicoquímicos", headerFont));
            headerCell1.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell1.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell1);

            var headerCell2 = new PdfPCell(new Phrase("Resultados", headerFont));
            headerCell2.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell2.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell2);

            var headerCell3 = new PdfPCell(new Phrase("LÍMITES DE CONFIANZA", headerFont));
            headerCell3.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell3.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell3);

            if (tipoRegistro == "agua")
            {
                // Parámetros para AGUA
                AgregarParametroAnalisis(table, "pH", registro.PH?.ToString(), "Aceptable: 6.5 - 8.5", normalFont);
                AgregarParametroAnalisis(table, "Cloro Residual", registro.CloroResidual?.ToString(), "Aceptable: 0.2 - 1.5 mg/L", normalFont);
                AgregarParametroAnalisis(table, "Acidez", registro.Acidez?.ToString(), "Máx. ~20 mg/L como CaCO₃", normalFont);
                AgregarParametroAnalisis(table, "Cloruro", registro.Cloruro?.ToString(), "Máx. 250 mg/L", normalFont);
                AgregarParametroAnalisis(table, "Sólidos Totales", registro.SolidosTotales?.ToString(), "Máx. 1000 mg/L (ideal ≤ 500 mg/L)", normalFont);
                AgregarParametroAnalisis(table, "Dureza", registro.Dureza?.ToString(), "Máx. 500 mg/L (recomendado <200)", normalFont);
                AgregarParametroAnalisis(table, "Temperatura Ambiente", registro.TemperaturaAmbiente?.ToString(), "Ideal: 15 - 25 °C", normalFont);
            }
            else
            {
                // Parámetros para ABA con referencias específicas
                AgregarParametroAnalisis(table, "pH", registro.PH?.ToString(), "Alimentos: 4.6 (punto crítico) - Bebidas: 3.0 - 4.2 aprox.", normalFont);
                AgregarParametroAnalisis(table, "Acidez", registro.Acidez?.ToString(), "Depende del producto: vinos 6-9 g/L; jugos 0.1-0.3%", normalFont);
                AgregarParametroAnalisis(table, "Cloro Residual", registro.CloroResidual?.ToString(), "Solo en agua usada: 0.2 - 1.5 mg/L", normalFont);
                AgregarParametroAnalisis(table, "Cenizas", registro.Cenizas?.ToString(), "Alimentos: 2-5% máx. depende del producto", normalFont);
                AgregarParametroAnalisis(table, "Cumarina", registro.Cumarina?.ToString(), "Permitido solo trazas (aditivo restringido)", normalFont);
                AgregarParametroAnalisis(table, "Cloruro", registro.Cloruro?.ToString(), "En bebidas ≤ 250 mg/L", normalFont);
                AgregarParametroAnalisis(table, "Densidad", registro.Densidad?.ToString(), "Vinos: 0.990 - 1.010 g/mL, depende alcohol", normalFont);
                AgregarParametroAnalisis(table, "Dureza", registro.Dureza?.ToString(), "Máx. 500 mg/L (recomendado <200)", normalFont);
                AgregarParametroAnalisis(table, "Extracto Seco", registro.ExtractoSeco?.ToString(), "Depende del producto: vino > 18 g/L", normalFont);
                AgregarParametroAnalisis(table, "Fécula", registro.Fecula?.ToString(), "Alimentos: presente en harinas, no en bebidas", normalFont);
                AgregarParametroAnalisis(table, "Grado Alcohólico", registro.GradoAlcoholico?.ToString(), "Vinos 8-15%, cervezas 3-8%, spirits 20-50%", normalFont);
                AgregarParametroAnalisis(table, "Humedad", registro.Humedad?.ToString(), "Alimentos secos máx. 10-15%", normalFont);
                AgregarParametroAnalisis(table, "Índice Refracción", registro.IndiceRefaccion?.ToString(), "Jugos/frutas: 1.333 - 1.350", normalFont);
                AgregarParametroAnalisis(table, "Índice Acidez", registro.IndiceAcidez?.ToString(), "Aceites: oleico máx. 0.6 - 2.0", normalFont);
                AgregarParametroAnalisis(table, "Índice Rancidez", registro.IndiceRancidez?.ToString(), "Valor Peróxidos aceites < 20 meqO2/kg", normalFont);
                AgregarParametroAnalisis(table, "Materia Grasa Cualitativa", registro.MateriaGrasaCualit?.ToString(), "Solo aplicable en lácteos/aceites", normalFont);
                AgregarParametroAnalisis(table, "Materia Grasa Cuantitativa", registro.MateriaGrasaCuantit?.ToString(), "Leches 3.0-3.5%, aceites 100%", normalFont);
                AgregarParametroAnalisis(table, "Prueba de Eber", registro.PruebaEber?.ToString(), "Usada en vinos para aldehídos", normalFont);
                AgregarParametroAnalisis(table, "Sólidos Totales", registro.SolidosTotales?.ToString(), "Jugos naturales: 8-12°Brix", normalFont);
                AgregarParametroAnalisis(table, "Tiempo de Cocción", registro.TiempoCoccion?.ToString(), "Depende del alimento", normalFont);
                // Nota: TemperaturaAmbiente no existe en RegistroAba
                // AgregarParametroAnalisis(table, "Temperatura Ambiente", registro.TemperaturaAmbiente?.ToString(), "Ideal conservación: 15-25 °C", normalFont);
            }

            document.Add(table);
            document.Add(new Paragraph(" ", normalFont));
        }

        private void AgregarAnalisisMicrobiologicos(Document document, dynamic registro, string tipoRegistro, Font normalFont, Font headerFont)
        {
            var table = new PdfPTable(3);
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 50f, 25f, 25f });

            // Encabezado
            var headerCell1 = new PdfPCell(new Phrase("Análisis Microbiológicos", headerFont));
            headerCell1.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell1.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell1);

            var headerCell2 = new PdfPCell(new Phrase("Resultados", headerFont));
            headerCell2.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell2.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell2);

            var headerCell3 = new PdfPCell(new Phrase("LÍMITES DE CONFIANZA", headerFont));
            headerCell3.BackgroundColor = new BaseColor(200, 200, 200);
            headerCell3.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(headerCell3);

            if (tipoRegistro == "agua")
            {
                // Parámetros para AGUA
                AgregarParametroAnalisis(table, "Microorganismos Aerobios", 
                    registro.ResMicroorganismosAerobios?.ToString(), "≤ 100 UFC/mL", normalFont);
                AgregarParametroAnalisis(table, "Recuento Coliformes", 
                    registro.ResRecuentoColiformes?.ToString(), "Aceptable: 0 UFC/100 mL", normalFont);
                AgregarParametroAnalisis(table, "Coliformes Totales", 
                    registro.ResColiformesTotales?.ToString(), "Aceptable: 0 UFC/100 mL", normalFont);
                AgregarParametroAnalisis(table, "E. Coli", 
                    registro.ResEColi?.ToString(), "Aceptable: 0 UFC/100 mL", normalFont);
                AgregarParametroAnalisis(table, "Pseudomonas SPP", 
                    registro.ResPseudomonasSpp?.ToString(), "Aceptable: 0 UFC/100 mL", normalFont);
            }
            else
            {
                // Parámetros para ABA con referencias específicas
                AgregarParametroAnalisis(table, "Microorganismos Aerobios", 
                    registro.ResMicroorganismosAerobios?.ToString(), "≤ 10^5 UFC/g en la mayoría de alimentos", normalFont);
                AgregarParametroAnalisis(table, "Recuento Coliformes", 
                    registro.ResRecuentoColiformes?.ToString(), "≤ 10² UFC/g (según alimento)", normalFont);
                AgregarParametroAnalisis(table, "Coliformes Totales", 
                    registro.ResColiformesTotales?.ToString(), "Aceptable: 0 – 10² UFC/g dependiendo", normalFont);
                AgregarParametroAnalisis(table, "E. Coli", 
                    registro.ResEColi?.ToString(), "Ausente en 25 g / 100 mL", normalFont);
                AgregarParametroAnalisis(table, "Pseudomonas SPP", 
                    registro.ResPseudomonasSpp?.ToString(), "Ausente en 25 g", normalFont);
                AgregarParametroAnalisis(table, "Salmonella SPP", 
                    registro.ResSalmonellaSpp?.ToString(), "Ausente en 25 g", normalFont);
                AgregarParametroAnalisis(table, "Estafilococos Aureus", 
                    registro.ResEstafilococosAureus?.ToString(), "< 100 UFC/g en alimentos listos", normalFont);
                AgregarParametroAnalisis(table, "Hongos", 
                    registro.ResHongos?.ToString(), "≤ 10² – 10³ UFC/g (según norma)", normalFont);
                AgregarParametroAnalisis(table, "Levaduras", 
                    registro.ResLevaduras?.ToString(), "≤ 10² – 10³ UFC/g (según norma)", normalFont);
                AgregarParametroAnalisis(table, "Esterilidad Comercial", 
                    registro.ResEsterilidadComercial?.ToString(), "Conservas: deber cumplir (0 crecimiento)", normalFont);
                AgregarParametroAnalisis(table, "Listeria Monocytogenes", 
                    registro.ResListeriaMonocytogenes?.ToString(), "Ausente en 25 g", normalFont);
            }

            // Línea final
            var finalCell = new PdfPCell(new Phrase("NO HAY MÁS RESULTADOS DEBAJO DE ESTA LÍNEA", normalFont));
            finalCell.Colspan = 3;
            finalCell.HorizontalAlignment = Element.ALIGN_CENTER;
            finalCell.BackgroundColor = new BaseColor(240, 240, 240);
            table.AddCell(finalCell);

            document.Add(table);
            document.Add(new Paragraph(" ", normalFont));
        }

        private void AgregarMetodologiasYObservaciones(Document document, dynamic registro, string tipoRegistro, Font normalFont, Font headerFont)
        {
            // Crear tabla para metodologías y observaciones
            var table = new PdfPTable(2);
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 30f, 70f });

            // Otras Determinaciones
            AgregarCeldaTabla(table, "Otras Determinaciones:", normalFont, true);
            AgregarCeldaTabla(table, registro.OtrasDeterminaciones ?? "-", normalFont, false);

            // Referencia
            AgregarCeldaTabla(table, "Referencia:", normalFont, true);
            AgregarCeldaTabla(table, registro.Referencia ?? "-", normalFont, false);

            // Fecha Reporte - solo existe en RegistroAgua
            if (tipoRegistro == "agua")
            {
                var registroAgua = registro as RegistroAgua;
                AgregarCeldaTabla(table, "Fecha Reporte:", normalFont, true);
                AgregarCeldaTabla(table, registroAgua?.FechaReporte?.ToString("dd/MM/yyyy") ?? "-", normalFont, false);
            }

            document.Add(table);
            document.Add(new Paragraph(" ", normalFont));

            // Metodologías o Referencias
            document.Add(new Paragraph("Metodologías o Referencias: " + 
                (registro.MetodologiaReferencia ?? "Métodos de Análisis Modernos AOAC, Compendium of Methods for the Microbiological Examination of Food - APHA, Manual de Análisis Bacteriológicos - BAM."), 
                normalFont));
            
            // Equipos
            document.Add(new Paragraph("Equipos: " + 
                (registro.Equipos ?? "Los aplicables a estos ensayos."), 
                normalFont));
            
            // Observaciones
            document.Add(new Paragraph("Observación: " + 
                (registro.Observaciones ?? ""), 
                normalFont));

            document.Add(new Paragraph(" ", normalFont));
        }

        private void AgregarConclusionYFirmas(Document document, dynamic registro, Font normalFont, Font headerFont)
        {
            // Checkboxes para apto/no apto
            var aptoConsumo = registro.AptoConsumo == true;
            
            var aptoTable = new PdfPTable(4);
            aptoTable.WidthPercentage = 100;
            aptoTable.SetWidths(new float[] { 5f, 20f, 5f, 20f });

            var checkApto = new PdfPCell(new Phrase(aptoConsumo ? "☑" : "☐", normalFont));
            checkApto.Border = Rectangle.NO_BORDER;
            aptoTable.AddCell(checkApto);

            var labelApto = new PdfPCell(new Phrase("Apto Para Consumo", normalFont));
            labelApto.Border = Rectangle.NO_BORDER;
            aptoTable.AddCell(labelApto);

            var checkNoApto = new PdfPCell(new Phrase(!aptoConsumo ? "☑" : "☐", normalFont));
            checkNoApto.Border = Rectangle.NO_BORDER;
            aptoTable.AddCell(checkNoApto);

            var labelNoApto = new PdfPCell(new Phrase("No Apto Para Consumo", normalFont));
            labelNoApto.Border = Rectangle.NO_BORDER;
            aptoTable.AddCell(labelNoApto);

            document.Add(aptoTable);
            document.Add(new Paragraph(" ", normalFont));

            // Original/Copia
            var copiaTable = new PdfPTable(4);
            copiaTable.WidthPercentage = 100;
            copiaTable.SetWidths(new float[] { 5f, 15f, 5f, 15f });

            copiaTable.AddCell(new PdfPCell(new Phrase("☑", normalFont)) { Border = Rectangle.NO_BORDER });
            copiaTable.AddCell(new PdfPCell(new Phrase("Original", normalFont)) { Border = Rectangle.NO_BORDER });
            copiaTable.AddCell(new PdfPCell(new Phrase("☐", normalFont)) { Border = Rectangle.NO_BORDER });
            copiaTable.AddCell(new PdfPCell(new Phrase("Copia", normalFont)) { Border = Rectangle.NO_BORDER });

            document.Add(copiaTable);
            document.Add(new Paragraph(" ", normalFont));
            document.Add(new Paragraph(" ", normalFont));

            // Firmas
            var firmasTable = new PdfPTable(2);
            firmasTable.WidthPercentage = 100;
            firmasTable.SetWidths(new float[] { 50f, 50f });

            var firmaEncargado = new PdfPCell(new Phrase("_________________________\nEncargado(a) de Departamento", normalFont));
            firmaEncargado.Border = Rectangle.NO_BORDER;
            firmaEncargado.HorizontalAlignment = Element.ALIGN_CENTER;
            firmasTable.AddCell(firmaEncargado);

            var firmaDirector = new PdfPCell(new Phrase("_________________________\nDirector(a)", normalFont));
            firmaDirector.Border = Rectangle.NO_BORDER;
            firmaDirector.HorizontalAlignment = Element.ALIGN_CENTER;
            firmasTable.AddCell(firmaDirector);

            document.Add(firmasTable);
        }

        private void AgregarCeldaTabla(PdfPTable table, string texto, Font font, bool esCabecera)
        {
            var cell = new PdfPCell(new Phrase(texto, font));
            cell.Border = Rectangle.BOX;
            if (esCabecera)
            {
                cell.BackgroundColor = new BaseColor(240, 240, 240);
            }
            table.AddCell(cell);
        }

        private void AgregarParametroAnalisis(PdfPTable table, string parametro, string resultado, string limite, Font font)
        {
            table.AddCell(new PdfPCell(new Phrase(parametro, font)) { Border = Rectangle.BOX });
            table.AddCell(new PdfPCell(new Phrase(resultado ?? "-", font)) { Border = Rectangle.BOX });
            table.AddCell(new PdfPCell(new Phrase(limite, font)) { Border = Rectangle.BOX });
        }
    }
}
