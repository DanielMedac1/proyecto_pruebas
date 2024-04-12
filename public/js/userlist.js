$(document).ready(function () {
    $('#user-table').DataTable({
        scrollX: true,
        "language": {
            "decimal":          "",
            "emptyTable":       "No hay datos disponibles",
            "info":             "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty":        "Mostrando 0 a 0 de 0 registros",
            "infoFiltered":     "(filtrado de _MAX_ entradas totales)",
            "infoPostFix":      "",
            "thousands":        ",",
            "lengthMenu":       "Mostrar _MENU_ registros",
            "loadingRecords":   "Cargando...",
            "processing":       "Procesando...",
            "search":           "Buscar usuario:",
            "zeroRecords":      "No hay resultados disponibles",
            "paginate": {
                "first":        "Primero",
                "last":         "Último",
                "next":         "Siguiente",
                "previous":     "Anterior"
            },
            "aria": {
                "sortAscending":    ": Activar para ordenar la columna en orden ascendente",
                "sortDescending":   ": Activar para ordenar la columna en orden descendente"
            }
        },
        "columns": [
            { "searchable": true },
            { "searchable": false },
            { "searchable": false },
            { "searchable": false },
            { "searchable": false },
            { "searchable": false, "orderable": false }
        ],
        "columnDefs": [
            {
                "type": "date",
                "targets": [2],
                "render": function (data, type, row) {
                    // Convertir la cadena de texto en una fecha
                    var date = new Date(data);
                    // Formatear la fecha como dd-mm-yyyy
                    return date.toLocaleDateString('es-ES');
                }
            }

        ]
    });
});

function deleteUser(username) {
    Swal.fire({
        title: "¿Eliminar usuario?",
        text: `¿Deseas eliminar a ${username}? Los cambios no podrán ser revertidos.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if(result.isConfirmed) {
            var promise = $.ajax({
                type: 'DELETE',
                url: '/eliminar-usuario/' + username,

                //Lo que envío (en forma de JSON)
                data: JSON.stringify({ user: username }),
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'
            });
            promise.always(function (data) {
                if(data.res == "delete success") {
                    Swal.fire({
                        title: "¡Hecho!",
                        text: "Has eliminado el usuario correctamente.",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                } else if (data.res == "user invalid" || data.res == "delete error") {
                    Swal.fire({
                        title: "Error",
                        text: "No se ha podido eliminar el usuario.",
                        icon: "error"
                    });
                } else {
                    console.log("Error");
                }
            })
        }
    });
}

function turnToAdmin(username) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Desea convertir a ${username} en administrador?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if(result.isConfirmed) {
            var promise = $.ajax({
                type: 'PUT',
                url: '/turn-to-admin/' + username,

                //Lo que envío (en forma de JSON)
                data: JSON.stringify({ user: username }),
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'
            });
            promise.always(function (data) {
                if(data.res == "to-admin success") {
                    Swal.fire({
                        title: "¡Hecho!",
                        text: "El usuario ha sido convertido en administrador.",
                        icon: "success"
                    }).then(() => {
                        window.location.reload();
                    });
                } else if (data.res == "to-admin invalid" || data.res == "to-admin error") {
                    Swal.fire({
                        title: "Error",
                        text: "Se ha producido un error.",
                        icon: "error"
                    });
                } else {
                    console.log("Error");
                }
            })
        }
    });
}