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
        data: JSON.stringify({ username: usuario, email:email, password: contrasena}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";

    promise.always(function (data) {
        if (data.res == "register true") { //Si el login es exitoso
            window.location.replace("/iniciarSesion");
        } else if (data.res == "register invalid") { //Si no es exitoso
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> se ha producido un problema al registrar el usuario.
            </div>`
        } else if (data.res == "register failed") { //Ha faltado un parametro
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> hay algunos datos faltantes.
            </div>`
        } else if (data.res == "user exists") { //Ha faltado un parametro
                mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <b>Error:</b> el usuario ya existe. Prueba con otro nombre de usuario o e-mail.
                </div>`    
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
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

    //HAGO LA PETICION AL SERVIDOR Y GUARDO LA RESPUESTA EN LA VARIABLE PROMISE
    var promise = $.ajax({
        type: 'POST',
        url: '/iniciar',

        //Lo que envío (en forma de JSON)
        data: JSON.stringify({ username: usuario, password: contrasena}),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });

    var mensaje = document.getElementById('mensaje');
    mensaje.textContent = "";

    promise.always(function (data) {
        if (data.res == "login true") { //Si el login es exitoso
            window.location.replace("/ruta-prueba");
        } else if (data.res == "login invalid") { //Si no es exitoso
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> el usuario no existe o la contraseña es incorrecta.
            </div>`
        } else if (data.res == "login failed") { //Ha faltado un parametro
            mensaje.innerHTML = `<div class="mt-2 border-danger text-center alert alert-danger p-2" id="mensaje">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <b>Error:</b> hay algunos datos faltantes.
            </div>`
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
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
document.getElementById('formulario').addEventListener('keypress', function(event) {
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

