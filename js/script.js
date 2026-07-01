document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.querySelector(".buscador input");

    if (!buscador) return;

    const tarjetas = document.querySelectorAll(".categoria");

    buscador.addEventListener("keyup", () => {

        const texto = buscador.value.toLowerCase().trim();

        tarjetas.forEach(tarjeta => {

            const contenido = tarjeta.textContent.toLowerCase();

            if (contenido.includes(texto)) {

                tarjeta.style.display = "block";

            } else {

                tarjeta.style.display = "none";

            }

        });

    });

});
