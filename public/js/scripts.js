/**
 * Función para animar elementos
 */
function animar(selector, animacion) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        entry.target.classList.add("animate__animated");
        entry.target.classList.add(animacion);
        // Dejar de observar
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(document.querySelector(selector));
}

function cerrarSesion() {
  var promise = $.ajax({
    type: "POST",
    url: "/logout",
  });

  promise.always(function (data) {
    window.location.replace("/login");
  });
}

var contrasena = $("#pass").val();

function togglePasswordVisibility() {
  var passwordField = document.getElementById("pass");
  var eyeIcon = document.querySelector(".mostrar-pass svg");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.setAttribute("fill", "greenyellow");
    eyeIcon.setAttribute("viewBox", "0 0 16 16");
    eyeIcon.innerHTML =
      '<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>';
  } else {
    passwordField.type = "password";
    eyeIcon.setAttribute("fill", "greenyellow");
    eyeIcon.setAttribute("viewBox", "0 0 16 16");
    eyeIcon.innerHTML =
      '<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>';
  }
}

function toggleChangePassword() {
  $("#passDiv").show();
  $("#changePass").hide();
  $("#confirm").show();
  $("#cancel").show();
  $("#requisitos").show();
  $("#pass").prop("disabled", false);
  $("#pass").val("");
}

function cancelChangePassword() {
  $("#passDiv").hide();
  $("#changePass").show();
  $("#confirm").hide();
  $("#cancel").hide();
  $("#requisitos").hide();
  $("#pass").prop("disabled", true);
  $("#pass").val(contrasena);
}

function deleteUser() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Seguro que deseas eliminar tu cuenta?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Eliminar mi perfil",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      var promise = $.ajax({
        type: "DELETE",
        url: "/delete-user",

        //Lo que envío (en forma de JSON)
        data: JSON.stringify({ password: $("#pass").val() }),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
      });
      promise.always(async function (data) {
        if (data.res == "delete success") {
          await Swal.fire({
            title: "¡Hecho!",
            text: "Tu usuario ha sido eliminado correctamente.",
            icon: "success",
          });
          cerrarSesion();
        } else if (data.res == "delete error" || data.res == "delete invalid") {
          Swal.fire({
            title: "Error",
            text: "Se ha producido un error al eliminar tu usuario. Prueba de nuevo más tarde.",
            icon: "error",
          });
        } else {
          console.log("Error");
        }
      });
    }
  });
}

function confirmChanges() {
  Swal.fire({
    title: "Introduce tu contraseña",
    text: "Para asegurarnos de que eres tú, introduce tu contraseña para confirmar los cambios.",
    input: "password",
    inputAttributes: {
      autocapitalize: "off",
      autocomplete: "new-password",
    },
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    showLoaderOnConfirm: true,
  }).then((result) => {
    if (result.isConfirmed) {
      var promise = $.ajax({
        type: "PUT",
        url: "/change-password",
        data: JSON.stringify({
          currentPassword: result.value,
          newPassword: $("#pass").val(),
        }),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
      });
      promise.always(function (data) {
        if (data.res == "check error" || data.res == "check invalid") {
          Swal.fire({
            title: "Error",
            text: "Se ha producido un error. Prueba más tarde.",
            icon: "error",
          });
        } else if (data.res == "check incorrect") {
          Swal.fire({
            title: "Contraseña incorrecta",
            text: "La contraseña es incorrecta.",
            icon: "error",
          });
        } else if (data.res == "change error" || data.res == "change invalid") {
          Swal.fire({
            title: "Se ha producido un error",
            text: "Error",
            icon: "error",
          });
        } else if (data.res == "change success") {
          Swal.fire({
            title: "Bien hecho",
            text: "La contraseña ha cambiado correctamente.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              location.reload();
            }
          });
        } else {
          alert("Error");
        }
      });
    }
  });
}

function contactMail() {
  var name = $("#contact-name").val();
  var email = $("#contact-mail").val();
  var subject = $("#contact-subject").val();
  var message = $("#contact-message").val();
  var captcha = $("#g-recaptcha-response").val();

  var promise = $.ajax({
    type: "POST",
    url: "/contact",

    data: JSON.stringify({
      name: name,
      email: email,
      subject: subject,
      message: message,
      captcha: captcha,
    }),
    contentType: "application/json;charset=UTF-8",
    dataType: "json",
  });

  promise.always(function (data) {
    if (data.res == "contact success") {
      Swal.fire({
        title: "¡Hecho!",
        text: "Tu e-mail ha sido enviado. Te contestaremos lo antes posible.",
        icon: "success",
      });
    } else if (data.res == "contact failed") {
      Swal.fire({
        title: "Error",
        text: "Los datos están incompletos. Por favor, rellena todos los campos.",
        icon: "error",
      });
    } else if (data.res == "invalid captcha") {
      Swal.fire({
        title: "Error",
        text: "No has realizado el Captcha.",
        icon: "error",
      });
    } else {
      alert("Error");
    }
  });
}

var formContacto = document.getElementById("contact-form");
if (formContacto) {
  formContacto.addEventListener("input", function (event) {
    if (
      $("#contact-name").val() != "" &&
      $("#contact-mail").val() != "" &&
      $("#contact-subject").val() != "" &&
      $("#contact-message").val() != "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#contact-mail").val())
    ) {
      $("#submit").prop("disabled", false);
    } else {
      $("#submit").prop("disabled", true);
    }
  });
}

if ($("#pass").length) {
  var passLengthLi = document.getElementById("pass-length");
  var passUpperLi = document.getElementById("pass-upper");
  var passLowerLi = document.getElementById("pass-lower");
  var passDigitLi = document.getElementById("pass-digit");
  var passSpecialLi = document.getElementById("pass-special");

  var passPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~¿¡ºª€£¥©®™§±°`´¨^•∗¶…])[\w !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~¿¡ºª€£¥©®™§±°`´¨^•∗¶…]{8,}$/;
  $("#pass").on("input", function () {
    if ($(this).val().trim().length >= 8) {
      passLengthLi.classList.remove("text-danger");
      passLengthLi.classList.add("text-primary");
    } else {
      passLengthLi.classList.remove("text-primary");
      passLengthLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos una letra mayúscula
    if (/[A-Z]/.test($(this).val().trim())) {
      passUpperLi.classList.remove("text-danger");
      passUpperLi.classList.add("text-primary");
    } else {
      passUpperLi.classList.remove("text-primary");
      passUpperLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos una letra minúscula
    if (/[a-z]/.test($(this).val().trim())) {
      passLowerLi.classList.remove("text-danger");
      passLowerLi.classList.add("text-primary");
    } else {
      passLowerLi.classList.remove("text-primary");
      passLowerLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos un dígito
    if (/\d/.test($(this).val().trim())) {
      passDigitLi.classList.remove("text-danger");
      passDigitLi.classList.add("text-primary");
    } else {
      passDigitLi.classList.remove("text-primary");
      passDigitLi.classList.add("text-danger");
    }

    // Verificar si la contraseña contiene al menos un carácter especial
    if (
      /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~¿¡ºª€£¥©®™§±°`´¨^•∗¶…]/.test(
        $(this).val().trim()
      )
    ) {
      passSpecialLi.classList.remove("text-danger");
      passSpecialLi.classList.add("text-primary");
    } else {
      passSpecialLi.classList.remove("text-primary");
      passSpecialLi.classList.add("text-danger");
    }
    // Comprobar si el valor actual del campo de contraseña es diferente al valor almacenado
    if (
      $(this).val() !== contrasena &&
      $(this).val() !== "" &&
      passPattern.test($(this).val())
    ) {
      // Si son diferentes, habilitar el botón
      $("#confirm").prop("disabled", false);
    } else {
      // Si son iguales, deshabilitar el botón
      $("#confirm").prop("disabled", true);
    }

    $("#pass").keypress(function (event) {
      if (event.which === 13) {
        event.preventDefault();
        confirmChanges();
      }
    });
  });
}
