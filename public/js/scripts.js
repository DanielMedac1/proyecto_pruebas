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