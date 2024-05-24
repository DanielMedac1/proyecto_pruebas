$(document).ready(function () {
  var name = $("#name").val();
  var level = $("#nivelSelect").val();
  var description = $("#description").val();

  console.log(name + " " + level + " " + description);

  $("#name, #nivelSelect, #description").on("input", function () {
    if (
      name != $("#name").val() ||
      level != $("#nivelSelect").val() ||
      description != $("#description").val()
    ) {
      $("#submit").prop("disabled", false);
    } else {
      $("#submit").prop("disabled", true);
    }
  });

  var create = $("#create").val();
  if (create != null) {
    console.log("Podemos crear un curso");
    $("#name, #nivelSelect, #description").on("input", function () {
      if (
        $("#name").val().trim() !== "" &&
        $("#nivelSelect").val() !== null &&
        $("#description").val().trim() !== ""
      ) {
        $("#create").prop("disabled", false);
      } else {
        console.log("Estamos en el else y no se cumple");
        $("#create").prop("disabled", true);
      }
    });
  } else {
    console.log("No podemos crear un curso");
  }
});

function guardarCambios(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas guardar los cambios realizados?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      var name = $("#name").val();
      var level = $("#nivelSelect").val();
      var description = $("#description").val();

      var promise = $.ajax({
        type: "PUT",
        url: `/update-course/${id}`,
        data: JSON.stringify({
          name: name,
          level: level,
          description: description,
        }),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
      });
    }

    promise.always(function (data) {
      if (data.res == "update success") {
        Swal.fire({
          title: "¡Hecho!",
          text: "El curso se ha actualizado correctamente.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.replace("/cursos");
          }
        });
      } else if (data.res == "update error") {
        Swal.fire({
          title: "Error",
          text: "Se ha producido un error al actualizar el curso.",
          icon: "error",
        });
      } else if (data.res == "update invalid") {
        Swal.fire({
          title: "Error",
          text: "Se ha producido un error al actualizar el curso.",
          icon: "error",
        });
      } else {
        window.alert("Error");
      }
    });
  });
}

function borrarCurso(id) {
  Swal.fire({
    title: "¿Deseas eliminar el curso?",
    text: "Los cambios no podrán ser revertidos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      var promise = $.ajax({
        type: "DELETE",
        url: `/delete-course/${id}`,
      });
      promise.always(function (data) {
        if (data.res == "delete success") {
          Swal.fire({
            title: "¡Hecho!",
            text: "El curso se ha eliminado correctamente.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.replace("/cursos");
            }
          });
        } else if (data.res == "delete error") {
          Swal.fire({
            title: "Error",
            text: "Se ha producido un error al eliminar el curso.",
            icon: "error",
          });
        } else if (data.res == "delete invalid") {
          Swal.fire({
            title: "Error",
            text: "Se ha producido un error al eliminar el curso.",
            icon: "error",
          });
        } else {
          window.alert("Error");
        }
      });
    }
  });
}

function crearCurso() {
  var promise = $.ajax({
    type: "PUT",
    url: "/create-course",
    data: JSON.stringify({
      name: $("#name").val(),
      level: $("#nivelSelect").val(),
      description: $("#description").val(),
    }),
    contentType: "application/json;charset=UTF-8",
    dataType: "json",
  });

  promise.always(function (data) {
    if (data.res == "create success") {
      Swal.fire({
        title: "¡Hecho!",
        text: "El curso se ha creado correctamente.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          window.location.replace("/cursos");
        }
      });
    } else if (data.res == "create error") {
      Swal.fire({
        title: "Error",
        text: "Se ha producido un error al crear el curso.",
        icon: "error",
      });
    } else if (data.res == "create invalid") {
      Swal.fire({
        title: "Error",
        text: "Se ha producido un error al crear el curso.",
        icon: "error",
      });
    } else {
      window.alert("Error");
    }
  });
}