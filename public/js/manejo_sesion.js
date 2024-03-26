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

//Para que al presionar Enter se envíe la información
function handleEnterKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('submit').click();
    }
}
document.getElementById('formulario').addEventListener('keypress', function(event) {
    handleEnterKeyPress(event);
});