//lista de vuelos disponibles
const vuelos = [
    { destino: "Buenos Aires", precio: 45000},
    { destino: "Córdoba", precio: 38000},
    { destino: "Mendoza", precio: 42000 },
    { destino: "Bariloche", precio: 52000 },

];

let totalReserva = 0;
console.log(vuelos);
console.log("total inicial", totalReserva);

function ingresoPasajero(){
    let nombre = prompt("Bienvenido a Aeroteck.\n Ingrese su nombre:");
    alert("Hola " + nombre + " comenzaremos con su reserva.");
    console.log("pasajero", nombre);
    
}
//funcion para ingresar el nombre del pasajero
ingresoPasajero();

function mostrarVuelos(){
let mensajeVuelos = "Vuelos disponibles:\n"
for (let i=0; i<vuelos.length; i++){
    mensajeVuelos +=
    (i+1) + ". " + vuelos[i].destino + " $ " + vuelos[i].precio + "\n";
    
}
alert (mensajeVuelos);
console.log( "vuelos mostrados al usuario")
}
//funcion para mostrar los vuelos disponibles.
mostrarVuelos();

function reservarVuelo(){
    let continuar = true;
    while (continuar){
        let opcion = parseInt( 
            prompt("ingrese el numero de vuelo que desea reservar")
        );
        if(opcion>=1 && opcion<=vuelos.length ){
            totalReserva += vuelos[opcion - 1].precio;

            alert(
                "vuelo a " + vuelos[opcion - 1].destino + 
                " agregado.\n total parcial: $" + totalReserva
            );
            console.log( "vuelo reservado:", vuelos[opcion - 1].destino);
        }
        else {
            alert("Opción inválida. Intente nuevamente.");
        }

        continuar = confirm("¿Desea reservar otro vuelo?");
    }
}
//funcion para reservar elo los vuelos
reservarVuelo();


function finalizarReserva() {
    alert(
        "Reserva confirmada.\n" +
        "Total a pagar: $ " + totalReserva + "\n" +
        "Gracias por elegir Aeroteck."
    );

    console.log("Total final de la reserva: $", totalReserva);
}
//funcion para finalizar la reserva y muestre eltotal a pagar
finalizarReserva()