// Configuración de la API
const API_BASE_URL = 'https://localhost:7051/api/public';

// Referencias a elementos del DOM
const tokenForm = document.getElementById('tokenForm');
const tokenInput = document.getElementById('tokenInput');
const consultBtn = document.getElementById('consultBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    tokenForm.addEventListener('submit', handleTokenSubmit);
    tokenInput.addEventListener('input', formatTokenInput);
});

// Formatear input del token (mayúsculas y espaciado)
function formatTokenInput(e) {
    let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    e.target.value = value;
}

// Manejar envío del formulario
async function handleTokenSubmit(e) {
    e.preventDefault();
    
    const token = tokenInput.value.trim();
    
    if (!token) {
        showError('Por favor ingrese un token válido');
        return;
    }
    
    if (token.length < 10) {
        showError('El token debe tener al menos 10 caracteres');
        return;
    }
    
    await consultarToken(token);
}

// Consultar token en la API
async function consultarToken(token) {
    showLoading(true);
    hideResult();
    
    try {
        const response = await fetch(`${API_BASE_URL}/validate-token/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            showSuccess(data);
        } else {
            showError(data.message || 'Token no válido');
        }
        
    } catch (error) {
        console.error('Error consultando token:', error);
        showError('Error de conexión. Verifique su conexión a internet e intente nuevamente.');
    } finally {
        showLoading(false);
    }
}

// Mostrar estado de carga
function showLoading(show) {
    if (show) {
        loadingSpinner.style.display = 'block';
        consultBtn.disabled = true;
        consultBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Consultando...';
    } else {
        loadingSpinner.style.display = 'none';
        consultBtn.disabled = false;
        consultBtn.innerHTML = '<i class="fas fa-search me-2"></i>Consultar Resultados';
    }
}

// Mostrar resultado exitoso
function showSuccess(data) {
    const registro = data.registro;
    const fechaExp = new Date(data.fechaExpiracion).toLocaleDateString('es-ES');
    
    // Determinar el estado del resultado
    let estadoClass = 'success';
    let estadoIcon = 'fa-check-circle';
    let estadoText = 'Apto para Consumo';
    
    if (registro.aptoConsumo === false) {
        estadoClass = 'danger';
        estadoIcon = 'fa-times-circle';
        estadoText = 'No Apto para Consumo';
    } else if (registro.aptoConsumo === null) {
        estadoClass = 'warning';
        estadoIcon = 'fa-question-circle';
        estadoText = 'Pendiente de Evaluación';
    }
    
    resultContent.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <i class="fas fa-check-circle text-success me-3" style="font-size: 2rem;"></i>
            <div>
                <h4 class="mb-0">Token Válido</h4>
                <p class="mb-0 opacity-75">Resultados encontrados exitosamente</p>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Número de Muestra</div>
                <div class="info-value">${registro.numMuestra || 'N/A'}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Tipo de Muestra</div>
                <div class="info-value">${registro.tipoMuestra || 'N/A'}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Fecha de Recepción</div>
                <div class="info-value">${registro.fechaRecepcion || 'N/A'}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Solicitante</div>
                <div class="info-value">${registro.solicitante || 'N/A'}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Estado del Análisis</div>
                <div class="info-value">
                    <i class="fas ${estadoIcon} text-${estadoClass} me-2"></i>
                    ${estadoText}
                </div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Token válido hasta</div>
                <div class="info-value">${fechaExp}</div>
            </div>
        </div>
        
        <div class="text-center mt-4">
            <a href="${API_BASE_URL}/pdf/${data.token}" 
               class="btn-download" 
               target="_blank"
               onclick="trackDownload('${data.token}')">
                <i class="fas fa-download me-2"></i>
                Descargar Informe Completo (PDF)
            </a>
        </div>
        
        <div class="mt-3 text-center">
            <small class="opacity-75">
                <i class="fas fa-info-circle me-1"></i>
                Accesos realizados: ${data.accesos} | Último acceso: ${new Date(data.registro.fechaRecepcion || Date.now()).toLocaleDateString('es-ES')}
            </small>
        </div>
    `;
    
    resultSection.className = 'result-section result-success';
    resultSection.style.display = 'block';
}

// Mostrar error
function showError(message) {
    resultContent.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <i class="fas fa-exclamation-triangle text-warning me-3" style="font-size: 2rem;"></i>
            <div>
                <h4 class="mb-0">Error en la Consulta</h4>
                <p class="mb-0 opacity-75">${message}</p>
            </div>
        </div>
        
        <div class="mt-3">
            <h6>Posibles soluciones:</h6>
            <ul class="mb-0">
                <li>Verifique que el token esté escrito correctamente</li>
                <li>Asegúrese de que el token no haya expirado</li>
                <li>Contacte al laboratorio si el problema persiste</li>
            </ul>
        </div>
        
        <div class="text-center mt-4">
            <button class="btn-download" onclick="resetForm()">
                <i class="fas fa-redo me-2"></i>
                Intentar Nuevamente
            </button>
        </div>
    `;
    
    resultSection.className = 'result-section result-error';
    resultSection.style.display = 'block';
}

// Ocultar resultado
function hideResult() {
    resultSection.style.display = 'none';
}

// Resetear formulario
function resetForm() {
    tokenInput.value = '';
    hideResult();
    tokenInput.focus();
}

// Rastrear descarga de PDF
function trackDownload(token) {
    console.log(`PDF descargado para token: ${token}`);
    // Aquí podrías agregar analytics o tracking adicional
}

// Manejar errores de red
window.addEventListener('online', function() {
    if (document.querySelector('.result-error')) {
        showInfo('Conexión restaurada. Puede intentar nuevamente.');
    }
});

window.addEventListener('offline', function() {
    showError('Sin conexión a internet. Verifique su conexión.');
});

// Mostrar información
function showInfo(message) {
    resultContent.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <i class="fas fa-info-circle text-info me-3" style="font-size: 2rem;"></i>
            <div>
                <h4 class="mb-0">Información</h4>
                <p class="mb-0 opacity-75">${message}</p>
            </div>
        </div>
    `;
    
    resultSection.className = 'result-section result-info';
    resultSection.style.display = 'block';
    
    // Auto-ocultar después de 3 segundos
    setTimeout(hideResult, 3000);
}
