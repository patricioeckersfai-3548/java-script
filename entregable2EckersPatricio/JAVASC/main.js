// ====== DATOS ======
const vuelos = [
    { destino: "Buenos Aires", precio: 45000 },
    { destino: "Córdoba", precio: 38000 },
    { destino: "Mendoza", precio: 42000 },
    { destino: "Bariloche", precio: 52000 }
];

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

// ====== FUNCIONES ======

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

function renderVuelos() {
  contenedorVuelos.innerHTML = "";

  vuelos.forEach((vuelo) => {
    const div = document.createElement("div");
    div.className = "vuelo";

    div.innerHTML = `
      <strong>${vuelo.destino}</strong> - $${vuelo.precio}
      <button class="btnReservar">Reservar</button>
    `;

    const boton = div.querySelector(".btnReservar");
    boton.addEventListener("click", () => {

  if (!nombreGuardado) {
    alert("Primero ingresá tu nombre para reservar.");
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
  alert("Este vuelo ya está reservado.");
  return;
}

reservaActual.vuelos.push(vuelo);
reservaActual.total += vuelo.precio;

  totalReserva = reservaActual.total;

  actualizarTotal();
  actualizarCantidad();
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

  if (!reservaActual) return;

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

// ====== EVENTOS ======

formPasajero.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoNombre = inputNombre.value.trim();

  if (!validarNombre(nuevoNombre)) {
    alert("Ingrese un nombre válido (solo letras).");
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
  guardarStorage();
  mostrarSaludo();
  formPasajero.reset();
});

finalizarBtn.addEventListener("click", () => {

  if (totalReserva === 0) {
    alert("No hay vuelos reservados.");
    return;
  }

  const reservaActual = reservas.find(
    r => r.pasajero === nombreGuardado
  );

  let listaVuelos = "";

  reservaActual.vuelos.forEach(vuelo => {
    listaVuelos += "- " + vuelo.destino + " ($" + vuelo.precio + ")\n";
  });

  alert(
    "Reserva confirmada para " + nombreGuardado +
    "\n\nVuelos reservados:\n" +
    listaVuelos +
    "\nTotal a pagar: $" + totalReserva +
    "\n\nGracias por elegir Aeroteck."
  );

  reservaActual.vuelos = [];
  reservaActual.total = 0;

  totalReserva = 0;

  guardarStorage();
  actualizarCantidad();
  actualizarTotal();
  renderCarrito();
});

  resetBtn.addEventListener("click", () => {

  totalReserva = 0;
  nombreGuardado = "";
  reservas = [];

  localStorage.removeItem("reservas");
  localStorage.removeItem("nombrePasajero");

  actualizarTotal();
  saludo.textContent = "";

  renderCarrito();   // limpia el carrito visual
  renderVuelos();    // vuelve a mostrar los vuelos
});
// ====== INICIO ======

actualizarTotal();
actualizarCantidad();
mostrarSaludo();
renderVuelos();
renderCarrito();