/**
 * Función para el registro del usuario
 */
function registrarUsuario() {
    var usuario = document.getElementById('user').value;
    var email = document.getElementById('email').value;
    var contrasena = document.getElementById('pass').value;

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/registrar',

        //Lo que envío (en forma de JSON)
        data: JSON.stringify({ username: usuario, email: email, password: contrasena }),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";

    promise.always(function (data) {
        mostrarSpinner();
        if (data.res == "register true") { //Si el login es exitoso
            window.location.replace("/login?reg=true");
        } else if (data.res == "register invalid") { //Si no es exitoso
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> se ha producido un problema al registrar el usuario.
            </div>`
        } else if (data.res == "register failed") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> hay algunos datos faltantes.
            </div>`
        } else if (data.res == "user exists") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <b>Error:</b> el usuario ya existe. Prueba con otro nombre de usuario o e-mail.
                </div>`
        } else if (data.res == "invalid username") {
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <b>Error:</b> el nombre del usuario es incorrecto.
                </div>`
        } else if (data.res == "invalid email") {
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <b>Error:</b> el e-mail es incorrecto.
                    </div>`
        } else if (data.res == "invalid password") {
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg>
                            <b>Error:</b> la contraseña es incorrecta.
                        </div>`
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            ocultarSpinner();
            window.alert("Error");
        }
    });

}

/**
 * Función para el inicio de sesión
 */
function iniciarSesion() {
    var usuario = document.getElementById('user').value;
    var contrasena = document.getElementById('pass').value;
    var remember = document.getElementById('remember');

    var recordarPass = false;
    if (remember.checked) {
        recordarPass = true;
    }

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/iniciar',

        //Lo que envío (en forma de JSON)
        data: JSON.stringify({ username: usuario, password: contrasena, remember: recordarPass }),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";

    promise.always(function (data) {
        mostrarSpinner();
        if (data.res == "login true") { //Si el login es exitoso
            window.location.replace("/home");
        } else if (data.res == "login invalid") { //Si no es exitoso
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> el usuario no existe o la contraseña es incorrecta.
            </div>`
        } else if (data.res == "login failed") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> hay algunos datos faltantes.
            </div>`
        } else if (data.res == "login error") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> se ha producido un fallo. Intentalo más tarde.
            </div>`
        } else if (data.res == "login unconfirmed") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <b>Error:</b> el usuario no está confirmado.
                </div>`

        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            ocultarSpinner();
            window.alert("Error");
        }
    });

}

/**
 * Función para resetear la contraseña
 */
function resetPass() {
    var emailReset = document.getElementById('emailReset').value;

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/reset-password',

        //Lo que envío (en forma de JSON)
        data: JSON.stringify({ email: emailReset }),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";

    promise.always(function (data) {
        mostrarSpinner();
        if (data.res == "email true") { //Si el login es exitoso
            ocultarSpinner();
            window.location.replace("/login?res=true");
        } else if (data.res == "email invalid") { //Si no es exitoso
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> el usuario no existe o la contraseña es incorrecta.
            </div>`
        } else if (data.res == "email error") { //Ha faltado un parametro
            ocultarSpinner();
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> se ha producido un error. Por favor, pruebe de nuevo.
            </div>`
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            ocultarSpinner();
            console.log("Email: " + emailReset);
            window.alert("Error");
        }
    });

}

/**
 * Función para hacer submit en el formulario con la tecla 'enter'
 */
function handleEnterKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('submit').click();
    }
}
document.getElementById('formulario').addEventListener('keypress', function (event) {
    handleEnterKeyPress(event);
});

/**
 * Función para mostrar y ocultar la contraseña
*/
function togglePasswordVisibility() {
    var passwordField = document.getElementById("pass");
    var eyeIcon = document.querySelector('.mostrar-pass svg');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.setAttribute('fill', 'greenyellow');
        eyeIcon.setAttribute('viewBox', '0 0 16 16');
        eyeIcon.innerHTML = '<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>';
    } else {
        passwordField.type = "password";
        eyeIcon.setAttribute('fill', 'greenyellow');
        eyeIcon.setAttribute('viewBox', '0 0 16 16');
        eyeIcon.innerHTML = '<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>';
    }
}


var usuario = document.getElementById('user');
var contrasena = document.getElementById('pass');
var email = document.getElementById('email');
var button = document.getElementById('submit');
var emailReset = document.getElementById('emailReset');

// Función para validar ambos campos
function validarCamposLogin() {
    // Verificar si ambos campos tienen algún valor
    if (usuario.value.trim() !== "" && !/\s/.test(usuario.value.trim()) && usuario.value.trim().length > 5 && contrasena.value.trim() !== "") {
        // Si ambos campos tienen valor, habilitar el botón
        button.disabled = false;
    } else {
        // Si algún campo está vacío, deshabilitar el botón
        button.disabled = true;
    }
}

/* function validarCamposRegister() {
    // Normas de la contraseña:
    // 1. Al menos 8 caracteres de longitud
    // 2. Al menos una letra mayúscula (A-Z)
    // 3. Al menos una letra minúscula (a-z)
    // 4. Al menos un dígito (0-9)
    // 5. Al menos un carácter especial (por ejemplo, ! @ # $ % ^ & *)
    var passPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;

    // Expresión regular para validar el formato del email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si todos los campos tienen algún valor y si el email tiene el formato correcto
    if (usuario.value.trim() !== "" && email.value.trim() !== "" && contrasena.value.trim() !== "" && emailPattern.test(email.value.trim()) && passPattern.test(contrasena.value.trim())) {
        // Si todos los campos tienen valor y el email tiene el formato correcto, habilitar el botón
        button.disabled = false;
    } else {
        // Si algún campo está vacío o el email no tiene el formato correcto, deshabilitar el botón
        button.disabled = true;
    }
} */

function validarCamposRegister() {
    // Normas de la contraseña:
    // 1. Al menos 8 caracteres de longitud
    // 2. Al menos una letra mayúscula (A-Z)
    // 3. Al menos una letra minúscula (a-z)
    // 4. Al menos un dígito (0-9)
    // 5. Al menos un carácter especial (por ejemplo, ! @ # $ % ^ & *)
    var passLengthLi = document.getElementById("pass-length");
    var passUpperLi = document.getElementById("pass-upper");
    var passLowerLi = document.getElementById("pass-lower");
    var passDigitLi = document.getElementById("pass-digit");
    var passSpecialLi = document.getElementById("pass-special");

    // Verificar si la contraseña tiene al menos 8 caracteres de longitud
    if (contrasena.value.trim().length >= 8) {
        passLengthLi.classList.remove("text-danger");
        passLengthLi.classList.add("text-primary");
    } else {
        passLengthLi.classList.remove("text-primary");
        passLengthLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos una letra mayúscula (A-Z)
    if (/[A-Z]/.test(contrasena.value.trim())) {
        passUpperLi.classList.remove("text-danger");
        passUpperLi.classList.add("text-primary");
    } else {
        passUpperLi.classList.remove("text-primary");
        passUpperLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos una letra minúscula (a-z)
    if (/[a-z]/.test(contrasena.value.trim())) {
        passLowerLi.classList.remove("text-danger");
        passLowerLi.classList.add("text-primary");
    } else {
        passLowerLi.classList.remove("text-primary");
        passLowerLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos un dígito (0-9)
    if (/\d/.test(contrasena.value.trim())) {
        passDigitLi.classList.remove("text-danger");
        passDigitLi.classList.add("text-primary");
    } else {
        passDigitLi.classList.remove("text-primary");
        passDigitLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos un carácter especial
    if (/[!@#$%^&*_,.-]/.test(contrasena.value.trim())) {
        passSpecialLi.classList.remove("text-danger");
        passSpecialLi.classList.add("text-primary");
    } else {
        passSpecialLi.classList.remove("text-primary");
        passSpecialLi.classList.add("text-danger");
    }

    // Verificar si todos los campos tienen algún valor y si el email tiene el formato correcto
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_,.-])[A-Za-z\d!@#$%^&*_,.-]{8,}$/;
    if (usuario.value.trim() !== "" && !/\s/.test(usuario.value.trim()) && email.value.trim() !== "" && contrasena.value.trim() !== "" && emailPattern.test(email.value.trim()) && passPattern.test(contrasena.value.trim()) && usuario.value.trim().length > 5) {
        // Si todos los campos tienen valor y el email tiene el formato correcto, habilitar el botón
        button.disabled = false;
    } else {
        // Si algún campo está vacío o el email no tiene el formato correcto, deshabilitar el botón
        button.disabled = true;
    }
}

function validarCampoReset() {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailReset.value.trim() !== "" && emailPattern.test(emailReset.value.trim())) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

if (email && usuario && contrasena) {
    usuario.addEventListener("input", validarCamposRegister);
    email.addEventListener("input", validarCamposRegister);
    contrasena.addEventListener("input", validarCamposRegister);
} else if (emailReset) {
    emailReset.addEventListener("input", validarCampoReset);
} else {
    usuario.addEventListener("input", validarCamposLogin);
    contrasena.addEventListener("input", validarCamposLogin);
}

function mostrarSpinner() {
    var submit = document.getElementById("submit");
    submit.disabled = true;
    submit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
}

function ocultarSpinner() {
    var submit = document.getElementById("submit");
    submit.disabled = false;
    submit.innerHTML = 'Iniciar sesión';
}

var urlString = window.location.href;
var url = new URL(urlString);

var reg = url.searchParams.get('reg');
var res = url.searchParams.get('res');
if (reg == "true") {
    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";
    mensaje.innerHTML = `<div class="mt-2 border-success text-center alert alert-success p-2" id="mensaje">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                            <b>Éxito:</b> se ha enviado un e-mail a tu dirección de correo electrónico para confirmar tu usuario.
                        </div>`
}

if (res == "true") {
    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";
    mensaje.innerHTML = `<div class="mt-2 border-success text-center alert alert-success p-2" id="mensaje">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                            <b>Éxito:</b> se ha enviado un e-mail a tu dirección de correo electrónico para restablecer tu contraseña.
                        </div>`
}