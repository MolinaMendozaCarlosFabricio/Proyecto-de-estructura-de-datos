function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Aquí debes implementar la lógica de autenticación
  if (username === "admin" && password === "admin") {
      document.getElementById("admin-menu").classList.remove("hidden");
      document.getElementById("employee-menu").classList.add("hidden");
  } else if (username === "employee" && password === "employee") {
      document.getElementById("employee-menu").classList.remove("hidden");
      document.getElementById("admin-menu").classList.add("hidden");
  } else {
      alert("Usuario o contraseña incorrectos");
  }
}



class Nodo {
  constructor(vehiculo) {
    this.vehiculo = vehiculo;
    this.siguiente = null;
  }
}

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
  }

  insertarAlFinal(vehiculo) {
    const nuevoNodo = new Nodo(vehiculo);

    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let nodoActual = this.cabeza;
      while (nodoActual.siguiente) {
        nodoActual = nodoActual.siguiente;
      }
      nodoActual.siguiente = nuevoNodo;
    }
  }

  buscarNodoPorPlaca(placa) {
    let nodoActual = this.cabeza;
    while (nodoActual) {
      if (nodoActual.vehiculo.placa === placa) {
        return nodoActual;
      }
      nodoActual = nodoActual.siguiente;
    }
    return null; 
  }

  mostrarVehiculosMantenimiento(callback) {
    let nodoActual = this.cabeza;

    while (nodoActual) {
        if (nodoActual.vehiculo.necesitaMantenimiento) {
            callback(nodoActual.vehiculo);
        }
        nodoActual = nodoActual.siguiente;
    }
}

  actualizarKilometraje(placa, nuevoKilometraje) {
    const nodoVehiculo = this.buscarNodoPorPlaca(placa);
    if (nodoVehiculo) {
      nodoVehiculo.vehiculo.kilometraje = nuevoKilometraje;
      nodoVehiculo.vehiculo.contarKilometrajeParaMantenimiento = nuevoKilometraje - (nodoVehiculo.vehiculo.mantenimientos*5000);
      // Comprobar si necesita mantenimiento
      if (nodoVehiculo.vehiculo.contarKilometrajeParaMantenimiento >= 5000) {
        nodoVehiculo.vehiculo.necesitaMantenimiento = true;
        nodoVehiculo.vehiculo.contarKilometrajeParaMantenimiento=0;
        nodoVehiculo.vehiculo.mantenimientos=nodoVehiculo.vehiculo.mantenimientos+1;
      } else {
        nodoVehiculo.vehiculo.necesitaMantenimiento = false;
      }
      console.log(`Kilometraje actualizado para el vehículo con placa ${placa}: ${nuevoKilometraje}`);
      console.log(`El vehículo ${placa} ${nodoVehiculo.vehiculo.necesitaMantenimiento ? 'necesita' : 'no necesita'} mantenimiento.`);
    } else {
      console.log(`No se encontró ningún vehículo con la placa ${placa}`);
    }
  }


}

const listaVehiculos = new ListaEnlazada();

function registrarVehiculo() {
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const color = document.getElementById("color").value;
  const placa = document.getElementById("placa").value;
  const kilometraje = parseInt(document.getElementById("kilometraje").value);
  let contarKilometrajeParaMantenimiento = kilometraje;
  let mantenimientos=0;
  let necesitaMantenimiento=false;
  if (contarKilometrajeParaMantenimiento >= 5000){
    contarKilometrajeParaMantenimiento=0;
    mantenimientos=mantenimientos+1;
    necesitaMantenimiento=true;
  }

  const vehiculo = { marca: marca, modelo: modelo, color: color, placa: placa, kilometraje: kilometraje, necesitaMantenimiento: necesitaMantenimiento, contarKilometrajeParaMantenimiento: contarKilometrajeParaMantenimiento, mantenimientos: mantenimientos};
  listaVehiculos.insertarAlFinal(vehiculo);

  console.log("Vehículo registrado:", vehiculo);
}

function buscarVehiculo() {
  const placaBusqueda = document.getElementById("busqueda").value;
  const nodoVehiculo = listaVehiculos.buscarNodoPorPlaca(placaBusqueda);

  if (nodoVehiculo) {
    const vehiculo = nodoVehiculo.vehiculo;
    const necesitaMantenimiento = vehiculo.necesitaMantenimiento ? "Sí" : "No";
    
    document.getElementById("resultado").innerHTML = `
      Marca: ${vehiculo.marca}<br>
      Modelo: ${vehiculo.modelo}<br>
      Color: ${vehiculo.color}<br>
      Placa: ${vehiculo.placa}<br>
      Kilometraje: ${vehiculo.kilometraje}<br>
      Necesita Mantenimiento: ${necesitaMantenimiento}<br>
      <br>
      Nuevo Kilometraje: <input type="number" id="nuevoKilometraje" placeholder="Nuevo Kilometraje">
      <button onclick="actualizarKilometraje('${placaBusqueda}')">Actualizar</button>
    `;
  } else {
    document.getElementById("resultado").innerHTML = "Vehículo no encontrado";
  }
}  

// Función para actualizar el kilometraje del vehículo buscado
function actualizarKilometraje(placa) {
  const nuevoKilometraje = parseInt(document.getElementById("nuevoKilometraje").value);
  listaVehiculos.actualizarKilometraje(placa, nuevoKilometraje);
}

function mostrarVehiculosQueNecesitanMantenimiento() {
    console.log("Mostrando vehículos que necesitan mantenimiento.");
    const mantenimientoContainer = document.getElementById("mantenimiento-container");
    mantenimientoContainer.innerHTML = ""; // Limpiar contenido anterior

    listaVehiculos.mostrarVehiculosMantenimiento((vehiculo) => {
        if (vehiculo.necesitaMantenimiento) {
            const vehiculoElement = document.createElement("div");
            vehiculoElement.innerHTML = `
                <strong>Placa:</strong> ${vehiculo.placa}, 
                <strong>Kilometraje:</strong> ${vehiculo.kilometraje}<br>
                <strong>Mantenimientos:</strong> ${vehiculo.mantenimientos}
            `;
            mantenimientoContainer.appendChild(vehiculoElement);

            const checklistElement = document.createElement("ul");
            if (vehiculo.mantenimientos % 3 === 0) {
                checklistElement.innerHTML = `
                    <li>Cambio de aceite</li>
                    <li>Ajuste de frenos</li>
                    <li>Afinación</li>
                `;
            } else {
                checklistElement.innerHTML = `
                    <li>Cambio de aceite</li>
                    <li>Ajuste de frenos</li>
                `;
            }
            mantenimientoContainer.appendChild(checklistElement);

            const finalizarButton = document.createElement("button");
            finalizarButton.textContent = "Finalizar Mantenimiento";
            finalizarButton.onclick = () => {
                vehiculo.necesitaMantenimiento = false;
                mostrarVehiculosQueNecesitanMantenimiento();
            };
            mantenimientoContainer.appendChild(finalizarButton);
        }
    });
}