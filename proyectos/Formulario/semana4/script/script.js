// 🎯 SISTEMA DE VALIDACIÓN AVANZADA

const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

let estadoValidacion = {};

// Initialize validation state for each field based on its 'name' attribute
campos.forEach((campo) => {
    estadoValidacion[campo.name] = false;
});

// Validación de nombre
document.getElementById('nombre').addEventListener('input', function () {
    const valor = this.value.trim();
    const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);

    if (valor.length < 3) {
        mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
        marcarCampo(this, false);
    } else if (nombres.length < 1) { // This check might be redundant if valor.length < 3 catches it.
        mostrarError('errorNombre', 'Ingresa al menos 1 nombre');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoNombre', '✓ Nombre válido');
        marcarCampo(this, true);
    }
});

// Validación de Apellido (Updated ID from 'apellido' to 'apellidos' to match HTML)
document.getElementById('apellidos').addEventListener('input', function () {
    const valor = this.value.trim();
    const apellidos = valor.split(' ').filter((apellido) => apellido.length > 0);

    if (valor.length < 3) {
        mostrarError('errorApellidos', 'El apellido debe tener al menos 3 caracteres'); // Updated error ID
        marcarCampo(this, false);
    } else if (apellidos.length < 1) {
        mostrarError('errorApellidos', 'Ingresa al menos un apellido'); // Updated error ID
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoApellidos', '✓ Apellido válido'); // Updated success ID
        marcarCampo(this, true);
    }
});

// Validación de email
document.getElementById('correo').addEventListener('input', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.value)) {
        mostrarError('errorCorreo', 'Formato de email inválido');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoCorreo', '✓ Email válido');
        marcarCampo(this, true);
    }

    // Trigger confirmation email validation if it has a value
    const confirmarEmail = document.getElementById('confirmarEmail');
    if (confirmarEmail.value) confirmarEmail.dispatchEvent(new Event('input'));
});

// Confirmación de email (New validation for confirming email)
document.getElementById('confirmarEmail').addEventListener('input', function () {
    const email = document.getElementById('correo').value;
    if (this.value !== email) {
        mostrarError('errorConfirmar', 'Los correos no coinciden'); // Using existing error ID 'errorConfirmar'
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmar', '✓ Correos coinciden'); // Using existing success ID 'exitoConfirmar'
        marcarCampo(this, true);
    } else {
        ocultarMensaje('errorConfirmar');
        ocultarMensaje('exitoConfirmar');
        marcarCampo(this, false); // Mark as invalid if empty
    }
});


// Validación de contraseña
document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const fortaleza = calcularFortalezaPassword(password);
    actualizarBarraFortaleza(fortaleza);

    if (password.length < 8) {
        mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
        marcarCampo(this, false);
    } else if (fortaleza.nivel < 2) { // Changed to level 2 for 'media' strength as a minimum
        mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
        marcarCampo(this, true);
    }

    const confirmar = document.getElementById('confirmarPassword');
    if (confirmar.value) confirmar.dispatchEvent(new Event('input'));
});

// Confirmación de contraseña
document.getElementById('confirmarPassword').addEventListener('input', function () {
    const password = document.getElementById('password').value;
    if (this.value !== password) {
        mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
        marcarCampo(this, false);
    } else if (this.value.length > 0) {
        mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
        marcarCampo(this, true);
    } else { // Handle empty confirmation field
        ocultarMensaje('errorConfirmar');
        ocultarMensaje('exitoConfirmar');
        marcarCampo(this, false); // Mark as invalid if empty
    }
});

// Validación teléfono
document.getElementById('telefono').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, ''); // Remove non-digits
    
    // Apply formatting
    if (valor.length > 6) {
        valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
    } else if (valor.length > 3) {
        valor = valor.substring(0, 3) + '-' + valor.substring(3);
    }
    this.value = valor;

    const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!telefonoRegex.test(valor)) {
        mostrarError('errorTelefono', 'Formato: 300-123-4567');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoTelefono', '✓ Teléfono válido');
        marcarCampo(this, true);
    }
});

// Fecha de nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function () {
    const fechaNacimientoInput = this.value; // Get the date string from the input

    // *** CRITICAL VALIDATION: Check if the input field is empty first ***
    if (!fechaNacimientoInput) {
        mostrarError('errorFecha', 'La fecha de nacimiento es obligatoria');
        marcarCampo(this, false);
        return; // Stop further validation if empty
    }

    const fechaNacimiento = new Date(fechaNacimientoInput); // Convert to Date object

    // *** CRITICAL VALIDATION: Check if the Date object is invalid (e.g., from a malformed string) ***
    if (isNaN(fechaNacimiento.getTime())) {
        mostrarError('errorFecha', 'Ingresa una fecha de nacimiento válida');
        marcarCampo(this, false);
        return; // Stop further validation if invalid
    }

    const hoy = new Date(); // Current date
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear(); // Initial age based on year difference

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edad--;
    }

    // Now, apply the age-based validation rules
    if (edad < 18) {
        mostrarError('errorFecha', 'Debes ser mayor de 18 años');
        marcarCampo(this, false);
    } else if (edad > 100) {
        // You might want to adjust this upper limit based on typical user ages
        mostrarError('errorFecha', 'Fecha no válida (demasiado antigua)');
        marcarCampo(this, false);
    } else {
        mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
        marcarCampo(this, true);
    }
});

// Comentarios
document.getElementById('comentarios').addEventListener('input', function () {
    const contador = document.getElementById('contadorComentarios');
    contador.textContent = this.value.length;

    if (this.value.length > 450) {
        contador.style.color = '#dc3545'; // Red for near max
    } else if (this.value.length > 400) {
        contador.style.color = '#ffc107'; // Yellow for approaching max
    } else {
        contador.style.color = '#666'; // Default color
    }
    
    // Comments field is always considered valid for progress, just showing character count
    marcarCampo(this, true);
});

// Términos y condiciones
document.getElementById('terminos').addEventListener('change', function () {
    if (!this.checked) {
        mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
        marcarCampo(this, false);
    } else {
        ocultarMensaje('errorTerminos');
        marcarCampo(this, true);
    }
});

// --- FUNCIONES AUXILIARES ---

/**
 * Muestra un mensaje de error para un campo específico.
 * @param {string} idElemento - El ID del elemento HTML donde se mostrará el error (e.g., 'errorNombre').
 * @param {string} mensaje - El mensaje de error a mostrar.
 */
function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) { // Check if element exists
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        // Hide corresponding success message
        ocultarMensaje(idElemento.replace('error', 'exito'));
    }
}

/**
 * Muestra un mensaje de éxito para un campo específico.
 * @param {string} idElemento - El ID del elemento HTML donde se mostrará el éxito (e.g., 'exitoNombre').
 * @param {string} mensaje - El mensaje de éxito a mostrar.
 */
function mostrarExito(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) { // Check if element exists
        elemento.textContent = mensaje;
        elemento.style.display = 'block';
        // Hide corresponding error message
        ocultarMensaje(idElemento.replace('exito', 'error'));
    }
}

/**
 * Oculta un mensaje (error o éxito) para un campo específico.
 * @param {string} idElemento - El ID del elemento HTML a ocultar.
 */
function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.style.display = 'none';
    }
}

/**
 * Marca visualmente un campo como válido o inválido y actualiza el estado de validación.
 * @param {HTMLElement} campo - El elemento del input, textarea o select.
 * @param {boolean} esValido - Indica si el campo es válido (true) o inválido (false).
 */
function marcarCampo(campo, esValido) {
    if (campo.name) { // Ensure the field has a name attribute
        estadoValidacion[campo.name] = esValido;
        campo.classList.toggle('valido', esValido);
        campo.classList.toggle('invalido', !esValido);
        actualizarProgreso();
        actualizarBotonEnvio();
    }
}

/**
 * Calcula la fortaleza de una contraseña basándose en varios criterios.
 * @param {string} password - La contraseña a evaluar.
 * @returns {object} Un objeto con el nivel de fortaleza (0-4), texto descriptivo y puntos.
 */
function calcularFortalezaPassword(password) {
    let puntos = 0;
    if (password.length >= 8) puntos++;
    if (password.length >= 12) puntos++;
    if (/[a-z]/.test(password)) puntos++; // Lowercase letters
    if (/[A-Z]/.test(password)) puntos++; // Uppercase letters
    if (/[0-9]/.test(password)) puntos++; // Numbers
    if (/[^A-Za-z0-9\s]/.test(password)) puntos++; // Special characters (excluding space)

    // Define strength levels
    const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
    // Map points to levels (max 6 points, map to 5 levels)
    const nivel = Math.min(Math.floor(puntos * (niveles.length - 1) / 6), niveles.length - 1);
    
    return { nivel, texto: niveles[nivel], puntos };
}

/**
 * Actualiza la barra visual de fortaleza de la contraseña.
 * @param {object} fortaleza - El objeto de fortaleza retornado por `calcularFortalezaPassword`.
 */
function actualizarBarraFortaleza(fortaleza) {
    const barra = document.getElementById('strengthBar');
    if (barra) { // Check if element exists
        const clases = [
            'strength-weak',
            'strength-weak', // Level 1 can still be considered weak
            'strength-medium',
            'strength-strong',
            'strength-very-strong'
        ];
        barra.className = 'password-strength ' + clases[fortaleza.nivel];
    }
}

/**
 * Actualiza la barra de progreso del formulario y el porcentaje.
 */
function actualizarProgreso() {
    // Filter out fields like 'confirmarEmail' or 'confirmarPassword' from total if they just mirror other fields
    // and are not independent validation points for progress calculation.
    // For this example, we'll keep it simple and include all fields initialized in estadoValidacion.
    const totalCampos = Object.keys(estadoValidacion).length;
    const camposValidos = Object.values(estadoValidacion).filter((valido) => valido).length;
    const porcentaje = totalCampos > 0 ? Math.round((camposValidos / totalCampos) * 100) : 0;
    
    const barraProgreso = document.getElementById('barraProgreso');
    const porcentajeProgreso = document.getElementById('porcentajeProgreso');

    if (barraProgreso) barraProgreso.style.width = porcentaje + '%';
    if (porcentajeProgreso) porcentajeProgreso.textContent = porcentaje + '%';
}


/**
 * Actualiza el estado del botón de envío (habilitado/deshabilitado)
 * según si todos los campos requeridos son válidos.
 */
function actualizarBotonEnvio() {
    // Ensure all registered fields are valid
    const todosValidos = Object.values(estadoValidacion).every((valido) => valido);
    btnEnviar.disabled = !todosValidos;
}

// Envío de formulario
formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Re-run all validations on submit to catch any un-triggered ones
    campos.forEach(campo => {
        // Trigger input/change event for fields that might not have been interacted with
        if (campo.type === 'checkbox' || campo.type === 'radio' || campo.type === 'select-one' || campo.type === 'date') {
            campo.dispatchEvent(new Event('change'));
        } else {
            campo.dispatchEvent(new Event('input'));
        }
    });

    // If after re-validation, not all fields are valid, prevent submission
    const todosValidos = Object.values(estadoValidacion).every((valido) => valido);
    if (!todosValidos) {
        console.warn('⚠️ Formulario no enviado: Hay campos inválidos.');
        // Optionally scroll to the first invalid field
        const firstInvalid = Object.keys(estadoValidacion).find(key => !estadoValidacion[key]);
        if (firstInvalid) {
            document.querySelector(`[name="${firstInvalid}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }


    const datosFormulario = new FormData(this);
    let resumenHTML = '<h3>Resumen de Datos:</h3>';

    // Iterate over form data to build the summary
    for (let [campo, valor] of datosFormulario.entries()) {
        // Exclude confirmation fields from the summary as they are duplicates
        if (campo === 'confirmarPassword' || campo === 'confirmarEmail' || campo === 'terminos') {
            // Special handling for terms checkbox to display if checked
            if (campo === 'terminos' && valor === 'on') {
                resumenHTML += `<div class="dato-resumen"><span class="etiqueta-resumen">Términos aceptados:</span> Sí</div>`;
            }
            continue;
        }

        // Only add fields with values to the summary
        if (valor && valor.trim() !== '') {
            const nombreCampo = obtenerNombreCampo(campo);
            // Mask password in summary
            if (campo === 'password') {
                valor = '********';
            }
            resumenHTML += `<div class="dato-resumen"><span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}</div>`;
        }
    }

    document.getElementById('contenidoResumen').innerHTML = resumenHTML;
    document.getElementById('resumenDatos').style.display = 'block';
    document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });

    console.log('📊 Formulario enviado con validación completa:', Object.fromEntries(datosFormulario));
});

/**
 * Mapea el nombre del campo (atributo 'name') a un nombre legible para mostrar en el resumen.
 * @param {string} campo - El atributo 'name' del campo del formulario.
 * @returns {string} El nombre legible del campo.
 */
function obtenerNombreCampo(campo) {
    const nombres = {
        nombre: 'Nombres Completos',
        apellidos: 'Apellidos Completos', // Updated key to 'apellidos'
        correo: 'Correo electrónico',
        confirmarEmail: 'Confirmación de correo', // Added
        password: 'Contraseña',
        confirmarPassword: 'Confirmación de contraseña',
        telefono: 'Teléfono',
        fechaNacimiento: 'Fecha de nacimiento',
        comentarios: 'Comentarios',
        terminos: 'Términos aceptados',
    };

    return nombres[campo] || campo;
}

/**
 * Reinicia el formulario a su estado inicial.
 */
function reiniciarFormulario() {
    formulario.reset();
    document.getElementById('resumenDatos').style.display = 'none'; // Hide the summary
    
    // Reset validation state for all fields
    Object.keys(estadoValidacion).forEach((campo) => {
        estadoValidacion[campo] = false;
    });

    // Remove validation classes from fields
    campos.forEach((campo) => campo.classList.remove('valido', 'invalido'));
    
    // Hide all error and success messages
    document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((msg) => (msg.style.display = 'none'));
    
    // Reset progress bar and button
    actualizarProgreso();
    actualizarBotonEnvio();
    
    // Reset password strength bar
    document.getElementById('strengthBar').className = 'password-strength';
}

// Initial state setup
document.addEventListener('DOMContentLoaded', () => {
    actualizarProgreso();
    actualizarBotonEnvio();
    // Ensure all messages are hidden on page load
    document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((msg) => (msg.style.display = 'none'));
});