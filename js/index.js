// DEFINIMOS FUNCION CONSTRUCTORA Y CREAMOS PRODUCTOS

class Producto {

    constructor(nombre, detalles, precio, unidadMedida) {
        this.nombre = nombre;
        this.detalles = detalles;
        this.precio = parseFloat(precio);
        this.unidadMedida = unidadMedida;

    }
}

//  DEFINIMOS FUNCION CONSTRUCTORA DE VENTA

class Venta {
    constructor(productoSeleccionado, cantidadComprada) {
        this.producto = productoSeleccionado;
        this.cantidad = cantidadComprada;
    }
}

/* Generación dinámica de HTML: creamos cards a partir del array de productos disponibles 
y los mostramos dentro de un div con class row
*/
productosDisponibles = [];

// Declaramos un array vacio para acumular la venta:
const arrayVenta = JSON.parse(localStorage.getItem("venta")) || [];
console.log(arrayVenta);

const URLJSON = "js/productos.json"
$.getJSON(URLJSON,
    function (respuesta, estado) {
        if (estado === "success") {
            let arrayJSON = respuesta;
            for (const elemento of arrayJSON) {
                productosDisponibles.push(new Producto(elemento.nombre, elemento.detalles, elemento.precio, elemento.unidadMedida));
            }
            crearFila(productosDisponibles.slice(0, 4));
            crearFila(productosDisponibles.slice(4, 8));

            //Agregamos animaciones al los botones comprar

            for (let i = 0; i < 30; i++) {
                $(".btnComprar").animate({ opacity: "0.5" }, "slow", "linear")
                    .delay(2000)
                    .animate({ opacity: "1", }, "slow", "linear");
            }
        }
    })
console.log(productosDisponibles);


const container = document.getElementById(`seccionPrincipal`);

function crearFila(arrayProductos) {
    const row = document.createElement('div');
    row.className = "row productos";
    container.appendChild(row);

    for (const producto of arrayProductos) {
        let columna = document.createElement('div');
        columna.className = "col";
        columna.innerHTML = `
            <div class="card mb-3 text-center" style="width: 18rem;">
            <img src="img/productos/${producto.nombre}.jpg" class="card-img-top" alt=${producto.nombre}>
                <h5 class="card-title mt-2">${producto.nombre.toUpperCase()}</h5>
                    <p class="card-text">${producto.detalles}: $${producto.precio} ${producto.unidadMedida}</p>
                    <button id="btnComprar_${producto.nombre}" nombre="${producto.nombre}" class="btn btn-primary btnComprar">Comprar</button>    
            </div>
            </div>`
        row.appendChild(columna);

        // Agregamos eventos a los botones de Compra de cada poducto en forma dinámica:

        $(`#btnComprar_${producto.nombre}`).click(e => {

            let productoVendido = productosDisponibles.find(producto => producto.nombre === e.target.getAttribute("nombre"));
            let ventaExistente = arrayVenta.find(x => x.producto.nombre === e.target.getAttribute("nombre"));

            if (ventaExistente) {
                arrayVenta.forEach((venta, index) => {
                    if (venta.producto.nombre === productoVendido.nombre) {
                        arrayVenta[index] = new Venta(productoVendido, ++venta.cantidad);
                    }
                });
            } else {
                arrayVenta.push(new Venta(productoVendido, 1));
            }
            localStorage.setItem("venta", JSON.stringify(arrayVenta));
            swal("mmm yummy!", "El producto fue agregado al carrito", "success");
        });
    }

    console.log(container);
}


$(document).ready(function () {
    //Agregamos un evento al boton carrito del menú para que nos rediriga a la página de checkout:

    $("#btnCarrito").click(e => {
        location.href = "html/carrito.html";
    });

    $("a").click(e => {
        e.preventDefault();
        $("html, body").animate(
            {
                scrollTop: $("#seccionPrincipal").offset().top
            },
            500,
            "linear"
        )
    });
})





