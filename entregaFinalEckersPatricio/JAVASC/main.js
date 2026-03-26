// ====== STORAGE ======
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
let nombreGuardado = localStorage.getItem("nombrePasajero") || "";
let totalReserva = 0;

// ====== SELECTORES ======
const contenedorVuelos = document.getElementById("contenedorVuelos");
const totalSpan = document.getElementById("total");
const formPasajero = document.getElementById("formPasajero");
const inputNombre = document.getElementById("nombrePasajero");
const saludo = document.getElementById("saludo");
const finalizarBtn = document.getElementById("finalizarBtn");
const resetBtn = document.getElementById("resetBtn");
const cantidadVuelos = document.getElementById("cantidadVuelos");
const buscador = document.getElementById("buscador");

// ====== FUNCIONES ======

let vuelos = [];

function cargarVuelos() {
    fetch("./data/vuelos.json")
    .then(response => response.json())
    .then(data => {
    vuelos = data;
    renderVuelos();
    })
    .catch(() => {});
}

function validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
    return regex.test(nombre);
}

function guardarStorage() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
    localStorage.setItem("nombrePasajero", nombreGuardado);
}

function actualizarTotal() {
    totalSpan.textContent = totalReserva;
}

function mostrarSaludo() {
    if (nombreGuardado) {
    saludo.textContent =
    "Hola " + nombreGuardado + ", seleccioná tu vuelo.";
    }
}

function renderVuelos(filtro = "") {
    contenedorVuelos.innerHTML = "";

    const vuelosFiltrados = vuelos.filter(v =>
    v.destino.toLowerCase().includes(filtro.toLowerCase())
    );
        if (vuelosFiltrados.length === 0) {
        contenedorVuelos.innerHTML = `<p style="color: red; font-weight: bold;">
            No se encontraron vuelos para "${filtro}".
        </p>`;
        }

    vuelosFiltrados.forEach((vuelo) => {
    const div = document.createElement("div");
    div.className = "vuelo";

    div.innerHTML = `
    <strong>${vuelo.destino}</strong> - $${vuelo.precio}
    <button class="btnReservar">Reservar</button>
    `;

    const boton = div.querySelector(".btnReservar");

    boton.addEventListener("click", () => {

    if (!nombreGuardado) {
        Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Primero ingresá tu nombre para poder reservar un vuelo."
        });
        return;
    }

    let reservaActual = reservas.find(
        (r) => r.pasajero === nombreGuardado
    );

        if (!reservaActual) {
        reservaActual = {
        pasajero: nombreGuardado,
        vuelos: [],
        total: 0,
        };
        reservas.push(reservaActual);
    }

    const yaReservado = reservaActual.vuelos.some(
        (v) => v.destino === vuelo.destino
    );

        if (yaReservado) {
        Swal.fire({
        icon: "info",
        title: "Vuelo ya seleccionado",
        text: `Ya tenés un ticket para ${vuelo.destino}`
        });
        return;
        }

    reservaActual.vuelos.push(vuelo);
    reservaActual.total += vuelo.precio;

    totalReserva = reservaActual.total;

    actualizarTotal();
    actualizarCantidad();
    renderResumen();
    guardarStorage();
    renderCarrito();
    });

    contenedorVuelos.appendChild(div);
    });
}

function renderCarrito() {
    const carrito = document.getElementById("carrito");
    carrito.innerHTML = "";

    const reservaActual = reservas.find(
    r => r.pasajero === nombreGuardado
);

    if (!reservaActual || reservaActual.vuelos.length === 0) {
    carrito.innerHTML = "<p>🛒 No hay vuelos en tu carrito.</p>";
    return;
}
    reservaActual.vuelos.forEach((vuelo, index) => {

    const div = document.createElement("div");

    div.innerHTML = `
        ${vuelo.destino} - $${vuelo.precio}
        <button data-index="${index}">Eliminar</button>
        `;

    const botonEliminar = div.querySelector("button");

    botonEliminar.addEventListener("click", () => {

        reservaActual.total -= vuelo.precio;
        reservaActual.vuelos.splice(index, 1);

        totalReserva = reservaActual.total;

    guardarStorage();
    actualizarTotal();
    renderResumen(); 
    actualizarCantidad();
    renderCarrito();
    });

    carrito.appendChild(div);
    });
}

function actualizarCantidad() {

    const reservaActual = reservas.find(
    (r) => r.pasajero === nombreGuardado
    );

    if (!reservaActual) {
    cantidadVuelos.textContent = "";
    return;
    }

    cantidadVuelos.textContent =
    "Vuelos reservados: " + reservaActual.vuelos.length;
}

function renderResumen() {

    const resumen = document.getElementById("resumen");

    if (!nombreGuardado) {
    resumen.innerHTML = "";
    return;
    }

    const reservaActual = reservas.find(
    (r) => r.pasajero === nombreGuardado
    );

    if (!reservaActual) {
    resumen.innerHTML = `
    <p>No hay vuelos seleccionados.</p>
    `;
    return;
    }

    resumen.innerHTML = `
    <h3>Resumen de tu reserva</h3>
    <p><strong>Pasajero:</strong> ${nombreGuardado}</p>
    <p><strong>Cantidad de vuelos:</strong> ${reservaActual.vuelos.length}</p>
    <p><strong>Total:</strong> $${reservaActual.total}</p>
    `;
}

// ====== EVENTOS ======

formPasajero.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoNombre = inputNombre.value.trim();

    if (!validarNombre(nuevoNombre)) {
        Swal.fire({
        icon: "error",
        title: "Nombre inválido",
        text: "Ingrese solo letras."
});
    return;
    }

    const cambioDePasajero = nuevoNombre !== nombreGuardado;

    nombreGuardado = nuevoNombre;

    const reservaExistente = reservas.find(
    (r) => r.pasajero === nombreGuardado
    );

    if (cambioDePasajero) {
        totalReserva = reservaExistente ? reservaExistente.total : 0;
        }

    actualizarTotal();
    actualizarCantidad();
    renderResumen();
    guardarStorage();
    mostrarSaludo();
    renderCarrito();
    formPasajero.reset();
});

    buscador.addEventListener("input", (e) => {
        renderVuelos(e.target.value);
});

    finalizarBtn.addEventListener("click", () => {
  // 1. Verificación inicial: ¿Hay algo para comprar?
  if (totalReserva === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No tenés vuelos para confirmar."
    });
    return;
    }

    const reservaActual = reservas.find(r => r.pasajero === nombreGuardado);
    if (!reservaActual) return;

  // PASO 1: Selección del medio de pago

    Swal.fire({
    title: "Seleccionar medio de pago",
    input: "select",
    inputOptions: {
    tarjeta: "💳 Tarjeta de crédito",
    debito: "💳 Tarjeta de débito",
    transferencia: "🏦 Transferencia bancaria"
    },
    inputPlaceholder: "Elegí una opción",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
        if (!value) {
        return "Debes seleccionar una opción";
        }
    }

}).then((result) => {
    if (!result.isConfirmed) return;

    const metodoPago = result.value;
    let htmlFormulario = "";

    // Definición de formularios según el método

    if (metodoPago === "tarjeta") {
        htmlFormulario = `
        <input id="nro" class="swal2-input" type="text" placeholder="Número de tarjeta">
        <input id="titular" class="swal2-input" type="text" placeholder="Nombre del titular">
        `;
    } else if (metodoPago === "debito") {
        htmlFormulario = `
        <input id="nroDebito" class="swal2-input" type="text" placeholder="Número de tarjeta débito">
        <input id="banco" class="swal2-input" type="text" placeholder="Banco Emisor">
        `;
    } else if (metodoPago === "transferencia") {
        htmlFormulario = `
        <input id="cbu" class="swal2-input" type="text" placeholder="CBU (22 dígitos)">
        <input id="alias" class="swal2-input" type="text" placeholder="Alias de la cuenta">
        `;
    }

    // PASO 2: Ingreso de datos específicos
    Swal.fire({
        title: "Datos de Facturación",
        html: htmlFormulario,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Validar datos",
        preConfirm: () => {

    if (metodoPago === "tarjeta") {
    const nro = document.getElementById("nro").value.trim();
    const titular = document.getElementById("titular").value.trim();

    if (!nro || !titular) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
    return false;
    }

    if (nro.length < 16) {
        Swal.showValidationMessage("La tarjeta debe tener 16 dígitos");
    return false;
        }
    }

    if (metodoPago === "debito") {
    const nro = document.getElementById("nroDebito").value.trim();
    const banco = document.getElementById("banco").value.trim();

    if (!nro || !banco) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
    return false;
        }
    }

    if (metodoPago === "transferencia") {
    const cbu = document.getElementById("cbu").value.trim();
    const alias = document.getElementById("alias").value.trim();

    if (!cbu || !alias) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
    return false;
    }

    if (cbu.length !== 22) {
        Swal.showValidationMessage("El CBU debe tener 22 dígitos");
        return false;
        }
    }

    return true;
}

    }).then((datosOk) => {
        if (!datosOk.isConfirmed) return;

      // PASO 3: Resumen final y confirmación
        let listaVuelosHtml = "<ul>";
        reservaActual.vuelos.forEach(v => {
        listaVuelosHtml += `<li style="text-align: left;">✈️ ${v.destino} - $${v.precio}</li>`;
        });
        listaVuelosHtml += "</ul>";

        Swal.fire({
            title: "Confirmar Compra Final",
            html: `
            <div style="text-align: left;">
            <p><strong>Pasajero:</strong> ${nombreGuardado}</p>
            <p><strong>Detalle:</strong></p>
            ${listaVuelosHtml}
            <hr>
            <p><strong>Método de pago:</strong> ${metodoPago.toUpperCase()}</p>
            <h4>Total a abonar: $${totalReserva}</h4>
            </div>
            `,

        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Finalizar Compra",
        cancelButtonText: "Revisar"
        }).then((confirmacion) => {
            if (confirmacion.isConfirmed) {
    

          // --- PROCESO DE CIERRE ---
        reservaActual.vuelos = [];
        reservaActual.total = 0;
        totalReserva = 0;

        guardarStorage();
        actualizarCantidad();
        actualizarTotal();
        renderCarrito();
        renderResumen();

        Swal.fire({
            title: "¡Buen viaje! ✈️",
            text: "Tu reserva en Aeroteck ha sido procesada con éxito.",
            icon: "success",
            confirmButtonColor: "#28a745"
                });
            }
        });
        });
    });
});

resetBtn.addEventListener("click", () => {

    totalReserva = 0;
    nombreGuardado = "";
    reservas = [];

    localStorage.removeItem("reservas");
    localStorage.removeItem("nombrePasajero");

    actualizarTotal();
    actualizarCantidad();
    saludo.textContent = "";

    buscador.value = ""; 

    renderCarrito();
    renderVuelos(); 
    renderResumen();
});
// ====== INICIO ======

actualizarTotal();
actualizarCantidad();
renderResumen();
mostrarSaludo();
cargarVuelos();
renderCarrito();