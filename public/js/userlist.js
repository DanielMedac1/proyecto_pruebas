$(document).ready(function () {
    $('#user-table').DataTable({
        scrollX: true,
        "language": {
            "decimal": "",
            "emptyTable": "No hay datos disponibles",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ entradas totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ registros",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar usuario:",
            "zeroRecords": "No hay resultados disponibles",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": Activar para ordenar la columna en orden ascendente",
                "sortDescending": ": Activar para ordenar la columna en orden descendente"
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