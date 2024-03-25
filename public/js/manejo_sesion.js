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

    var mensajeError = document.getElementById('mensaje');
    mensajeError.textContent = "";

    promise.always(function () {
        if (data.res == "login true" && data.username) { //Si el login es exitoso
            window.location.replace("/chat");
            sessionStorage.setItem('nombreUsuario', data.username);
        } else if (data.res == "login invalid") { //Si no es exitoso
            var alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger';
            alertDiv.textContent = 'El usuario no existe o la contraseña no es correcta.';
            mensajeError.appendChild(alertDiv);
        } else if (data.res == "login failed") { //Ha faltado un parametro
            var alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger';
            alertDiv.textContent = 'Los parametros no están completos.';
            mensajeError.appendChild(alertDiv);
        } else { //Por si los datos son corruptos u otra cosa en vez de hacer que el cliente espere
            window.alert("Error");
        }
    });

}