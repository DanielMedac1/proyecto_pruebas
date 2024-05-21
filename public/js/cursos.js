$(document).ready(function () {
    var name = $("#name").val();
    var level = $("#nivelSelect").val();
    var description = $("#description").val();

    console.log(name + " " + level + " " + description);

    $("#name, #nivelSelect, #description").on("input", function () {
        if(name != $("#name").val() || level != $("#nivelSelect").val() || description != $("#description").val()){
            $("#submit").prop("disabled", false);
        } else {
            $("#submit").prop("disabled", true);
        }
    })
})

function guardarCambios() {
    var name = $("#name").val();
    var level = $("#nivelSelect").val();
    var description = $("#description").val();

    var promise = $.ajax({
        type: "",
    })
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
          url: `/delete-course/${id}`
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
            console.log("Error");
          }
        });
      }
    });
  }