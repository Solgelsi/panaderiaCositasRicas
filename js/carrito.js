

// Obtenemos del local storage los productos elegidos por el cliente y los guardamos en un array:

$(document).ready(function () {
    let ventaJS = JSON.parse(localStorage.getItem("venta"));
    console.log(ventaJS);

    // Geramos dinámicamente el HTML con el listado de productos vendidos:
    for (const venta of ventaJS) {

        //CON JQUERY
        $("#productosEnCarrito").append(
            `<div class="row justify-content-center animate__animated animate__fadeInLeftBig" id="nodoHijo_${venta.producto.nombre}">
            <div class="col-6 m-2 p-2 estiloFila">
                <h2>${venta.producto.nombre}</h2>
                <p>${venta.producto.detalles}</p>
                <label>Cuántas unidades querrías comprar?</label>
                <input id="cantidadVenta_${venta.producto.nombre}" value="${venta.cantidad}" type="number" class="inputCantidad" min="1" max="100">
                <span id="subtotalVenta_${venta.producto.nombre}">Subtotal: $${importeVenta(venta.cantidad, venta.producto.precio)}</span>
                <button id="btnEliminar_${venta.producto.nombre}" nombre="${venta.producto.nombre}" class="btn btn-secondary  btnEliminar">Eliminar</button>
                </div>
        </div>`);

        $(`#cantidadVenta_${venta.producto.nombre}`).change(e => {
            //obtener nueva cantidad
            let cantidad = parseInt(e.target.value);
            //calcular nuevo subtotal
            //actualizar el span a mostrar con el subtotal
            let subTotal = document.getElementById(`subtotalVenta_${venta.producto.nombre}`);
            subTotal.innerText = `Subtotal: $${importeVenta(cantidad, venta.producto.precio)}`;
            //actualizar el objeto venta seleccionado
            venta.cantidad = cantidad;
            // actualziar el importe total a pagar acumulado
            let total = document.getElementById("total");
            total.innerText = `$${calcularImporteTotal()}`;
        });

        //Asignamos evento click al botón eliminar producto

        $(`#btnEliminar_${venta.producto.nombre}`).click(e => {
            /**
             * eliminar nodo HTML del DOM
             * eliminar venta del arreglo de venta
             * recalcular el importe total
             * actualizar el localStorage con el nuevo arreglo de ventas
             */
            $(`#nodoHijo_${venta.producto.nombre}`).remove();
            ventaJS = $.grep(ventaJS, function (venta) {
                return venta.producto.nombre !== e.target.getAttribute("nombre");
            });
            $("#total").text(`$${calcularImporteTotal()}`);
            localStorage.setItem("venta", JSON.stringify(ventaJS));
        });

    }

    //declaración de función para el subtotal por producto

    function importeVenta(cantidad, precio) {
        return cantidad * precio;
    }

    //declaración de función para calcular el importe total a pagar

    function calcularImporteTotal() {
        let total = 0;
        for (const i of ventaJS) {
            total += importeVenta(i.cantidad, i.producto.precio);
        }
        return total;
    }
    let total = document.getElementById("total");
    total.innerText = `$${calcularImporteTotal()}`;



    // Funcionalidades del Formulario:

    //Con JQuery

    $("#cliente").submit(e => {
        e.preventDefault();
        //e.target.elements hace referencia a los inputs
        $.each(e.target.elements, function (i, value) {
            //agregamos condicion ya que solo nos interesan los tag inputs, sin el tag submit
            if (value.className === "form-control") {
                //mostramos por consola el valor ingresado por el usuario en cada input
                console.log(value.value);
            }
        });

        swal("Contacto agendado!");
    })

})

