/**
 * Función para animar elementos
 */
function animar(selector, animacion) {
    observer = new IntersectionObserver(entries => {
        // Recorrer las entradas recibidas
        entries.forEach(entry => {
            // Está visible en el viewport
            if (entry.intersectionRatio > 0) {
                // entry.target es el elemento que se está observando
                // Agregar la clase para animar
                entry.target.classList.add("animate__animated");
                entry.target.classList.add(animacion);
                // Dejar de observar
                observer.unobserve(entry.target);
            }
        });
    });
    // Observar elemento a animar
    observer.observe(document.querySelector(selector));
}

function cerrarSesion() {
    var promise = $.ajax({
        type: 'POST',
        url: '/destroy-session',
    });

    promise.always(function (data) {
        window.location.replace("/login");
    });

}

var contrasena = $("#pass").val();

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

function toggleChangePassword() {
    $('#changePass').hide();
    $('#confirm').show();
    $('#cancel').show();
    $("#pass").prop("disabled", false);

}

function cancelChangePassword() {
    $('#changePass').show();
    $('#confirm').hide();
    $('#cancel').hide();
    $("#pass").prop("disabled", true)
    $("#pass").val(contrasena);

}

function confirmChanges() {
    Swal.fire({
        title: "¿Estás segur@?",
        text: "¿Deseas guardar los cambios?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cambiar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            var promise = $.ajax({
                type: 'POST',
                url: '/change-password',

                //Lo que envío (en forma de JSON)
                data: JSON.stringify({ password: $("#pass").val() }),
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'
            });
            promise.always(function (data) {
                if (data.res == "change success") {
                    Swal.fire({
                        title: "¡Hecho!",
                        text: "Has cambiado tu contraseña correctamente.",
                        icon: "success"
                    });
                    contrasena = $("#pass").val();
                    $('#changePass').show();
                    $('#confirm').hide();
                    $('#cancel').hide();
                    $("#pass").prop("disabled", true);
                    $("#confirm").prop("disabled", true);
                } else if (data.res == "change error") {
                    Swal.fire({
                        title: "Error",
                        text: "Se ha producido un error al cambiar tu contraseña. Prueba de nuevo más tarde.",
                        icon: "error"
                    });
                } else if (data.res == "change invalid") {
                    Swal.fire({
                        title: "Error",
                        text: "La contraseña no cumple con los requisitos.",
                        icon: "error"
                    });
                }
            })
        }
    });
}

if ($("#pass").length) {
    var contrasena = $("#pass").val();
    $('#confirm').hide();
    $("#pass").on("input", function () {
        // Comprobar si el valor actual del campo de contraseña es diferente al valor almacenado
        if ($(this).val() !== contrasena) {
            // Si son diferentes, habilitar el botón
            $("#confirm").prop("disabled", false);
        } else {
            // Si son iguales, deshabilitar el botón
            $("#confirm").prop("disabled", true);
        }
    });
}