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

// ====== FUNCIONES ======

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
    
      boton.addEventListener("click", () => {

  //  validar que haya nombre
  if (!nombreGuardado) {
    alert("Primero ingresá tu nombre para reservar.");
    return;
  }

  // buscar o crear reserva del pasajero
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

  // agregar vuelo

  reservaActual.vuelos.push(vuelo);
  reservaActual.total += vuelo.precio;

  totalReserva = reservaActual.total;

  actualizarTotal();
  guardarStorage();
});

reservaActual.vuelos.push(vuelo);
reservaActual.total += vuelo.precio;

totalReserva = reservaActual.total;

actualizarTotal();
guardarStorage();
    });

    contenedorVuelos.appendChild(div);
  });
}

// ====== EVENTOS ======

formPasajero.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoNombre = inputNombre.value.trim();

  //  si cambia el pasajero, reiniciamos la reserva
  if (nombreGuardado && nuevoNombre !== nombreGuardado) {
    totalReserva = 0;
    actualizarTotal();
  }

  nombreGuardado = nuevoNombre;

  guardarStorage();
  mostrarSaludo();
  formPasajero.reset();

const reservaExistente = reservas.find(
    (r) => r.pasajero === nombreGuardado
  );

  totalReserva = reservaExistente ? reservaExistente.total : 0;
  actualizarTotal();
});

finalizarBtn.addEventListener("click", () => {
  alert(
    "Reserva confirmada.\nTotal a pagar: $" +
      totalReserva +
      "\nGracias por elegir Aeroteck."
  );
});

resetBtn.addEventListener("click", () => {
  totalReserva = 0;
  nombreGuardado = "";
  reservas = [];

  localStorage.removeItem("reservas");
  localStorage.removeItem("nombrePasajero");

  actualizarTotal();
  saludo.textContent = "";
});
// ====== INICIO ======

actualizarTotal();
mostrarSaludo();
renderVuelos();