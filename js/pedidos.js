// ==========================================
// KINGMIX - SISTEMA DE PEDIDOS
// APERTURA Y CIERRE DEL PANEL LATERAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
// ========================================
// KINGMIX - LISTA DE PRODUCTOS
// ========================================

let productosPedido = JSON.parse(
  localStorage.getItem("kingmixPedido") || "[]"
);

function agregarProducto(nombre, presentacion, cantidad, precio) {

  const productoExistente = productosPedido.find(
    producto =>
      producto.nombre === nombre &&
      producto.presentacion === presentacion
  );

  if (productoExistente) {

    productoExistente.cantidad += cantidad;

  } else {

    productosPedido.push({
      nombre: nombre,
      presentacion: presentacion,
      cantidad: cantidad,
      precio: precio
    });

  }
localStorage.setItem(
    "kingmixPedido",
    JSON.stringify(productosPedido)
);

actualizarContadorPedido();
mostrarProductosPedido();

console.log("Pedido actualizado:", productosPedido);
}

// ACTUALIZAR CONTADOR DEL PEDIDO

function actualizarContadorPedido() {

  const contador = document.getElementById("pedido-contador");

  if (!contador) {
    console.warn("No se encontró el contador del pedido");
    return;
  }

  const totalProductos = productosPedido.reduce(
    (total, producto) => total + Number(producto.cantidad),
    0
  );

  contador.textContent = totalProductos;
}

// Mostrar productos guardados al cargar la página
actualizarContadorPedido();
// ========================================
// MOSTRAR PRODUCTOS EN LA LISTA KINGMIX
// ========================================

function mostrarProductosPedido() {

  const contenedor = document.getElementById("pedido-productos");
  const totalElemento = document.getElementById("pedido-precio-total");
  const botonEnviar = document.getElementById("enviar-pedido");

  if (!contenedor || !totalElemento) return;

  // Si no hay productos
  if (productosPedido.length === 0) {

    contenedor.innerHTML = `
      <div class="pedido-vacio">
        <i class="fa-solid fa-basket-shopping"></i>
        <h3>Tu lista está vacía</h3>
        <p>Explorá nuestros productos y agregá tus favoritos.</p>
      </div>
    `;

    totalElemento.textContent = "$0";

    if (botonEnviar) botonEnviar.disabled = true;

    return;
  }

  let total = 0;

  contenedor.innerHTML = "";

  productosPedido.forEach((producto) => {

    const subtotal = producto.precio * producto.cantidad;

    total += subtotal;

    const elemento = document.createElement("div");

    elemento.className = "pedido-item";

    const nombre = document.createElement("strong");
    nombre.textContent = producto.nombre;

    const presentacion = document.createElement("p");
    presentacion.textContent = `Presentación: ${producto.presentacion}`;

// =====================================
// CONTROLES DE CANTIDAD
// =====================================

const cantidad = document.createElement("div");
cantidad.className = "pedido-cantidad";

const textoCantidad = document.createElement("span");
textoCantidad.textContent = "Cantidad:";

const controles = document.createElement("div");
controles.className = "pedido-controles";

const botonMenos = document.createElement("button");
botonMenos.type = "button";
botonMenos.className = "pedido-cantidad-boton";
botonMenos.textContent = "−";
botonMenos.setAttribute("aria-label", "Disminuir cantidad");

const numeroCantidad = document.createElement("span");
numeroCantidad.className = "pedido-cantidad-numero";
numeroCantidad.textContent = producto.cantidad;

const botonMas = document.createElement("button");
botonMas.type = "button";
botonMas.className = "pedido-cantidad-boton";
botonMas.textContent = "+";
botonMas.setAttribute("aria-label", "Aumentar cantidad");

// AUMENTAR CANTIDAD
botonMas.addEventListener("click", () => {
  producto.cantidad = Number(producto.cantidad) + 1;

  localStorage.setItem(
    "kingmixPedido",
    JSON.stringify(productosPedido)
  );

  actualizarContadorPedido();
  mostrarProductosPedido();
});

// DISMINUIR CANTIDAD
botonMenos.addEventListener("click", () => {
  if (Number(producto.cantidad) <= 1) return;

  producto.cantidad = Number(producto.cantidad) - 1;

  localStorage.setItem(
    "kingmixPedido",
    JSON.stringify(productosPedido)
  );

  actualizarContadorPedido();
  mostrarProductosPedido();
});

controles.append(botonMenos, numeroCantidad, botonMas);
cantidad.append(textoCantidad, controles);

    const precio = document.createElement("p");
    precio.textContent = `Subtotal: $${subtotal.toLocaleString("es-AR")}`;
// BOTÓN PARA ELIMINAR PRODUCTO INDIVIDUALMENTE

const botonEliminar = document.createElement("button");

botonEliminar.type = "button";
botonEliminar.className = "pedido-eliminar";
botonEliminar.textContent = "🗑️ Eliminar";

botonEliminar.addEventListener("click", () => {

  const indice = productosPedido.indexOf(producto);

  if (indice === -1) return;

  productosPedido.splice(indice, 1);

  localStorage.setItem(
    "kingmixPedido",
    JSON.stringify(productosPedido)
  );

  actualizarContadorPedido();
  mostrarProductosPedido();

});
 elemento.append(nombre, presentacion, cantidad, precio, botonEliminar);

    contenedor.appendChild(elemento);

  });

  totalElemento.textContent = "$" + total.toLocaleString("es-AR");

  if (botonEnviar) botonEnviar.disabled = false;

}

// Mostrar la lista al cargar la página
mostrarProductosPedido();
  // ELEMENTOS DEL HTML
  const botonAbrir = document.getElementById("abrir-pedido");
  const botonCerrar = document.getElementById("cerrar-pedido");
  const botonSeguir = document.getElementById("seguir-comprando");

  const panel = document.getElementById("panel-pedido");
  const overlay = document.getElementById("pedido-overlay");

  // Comprobar que los elementos existan
  if (!botonAbrir || !botonCerrar || !botonSeguir || !panel || !overlay) {
    console.warn("KingMix: faltan elementos del panel de pedidos.");
    return;
  }

  let ultimoFoco = null;

  // ABRIR PANEL
  function abrirPedido() {

    ultimoFoco = document.activeElement;

    panel.inert = false;
    panel.setAttribute("aria-hidden", "false");

    panel.classList.add("activo");
    overlay.classList.add("activo");

    botonAbrir.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";

    botonCerrar.focus();
  }

  // CERRAR PANEL
  function cerrarPedido() {

    panel.classList.remove("activo");
    overlay.classList.remove("activo");

    botonAbrir.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";

    // Esperar a que termine la animación
    const finalizarCierre = () => {
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");

      if (ultimoFoco && ultimoFoco.isConnected) {
        ultimoFoco.focus();
      } else {
        botonAbrir.focus();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finalizarCierre();
    } else {
      setTimeout(finalizarCierre, 350);
    }
  }

  // EVENTOS
  botonAbrir.addEventListener("click", abrirPedido);

  botonCerrar.addEventListener("click", cerrarPedido);

  botonSeguir.addEventListener("click", cerrarPedido);

  overlay.addEventListener("click", cerrarPedido);
  // =====================================
// VACIAR LISTA DE PEDIDOS
// =====================================

const botonVaciar = document.getElementById("vaciar-pedido");

if (botonVaciar) {
  botonVaciar.addEventListener("click", () => {

    if (productosPedido.length === 0) return;

    const confirmar = confirm(
      "¿Querés eliminar todos los productos de tu pedido?"
    );

    if (!confirmar) return;

    productosPedido.length = 0;

    localStorage.removeItem("kingmixPedido");

    actualizarContadorPedido();
    mostrarProductosPedido();

  });
}


// =====================================
// ENVIAR PEDIDO POR WHATSAPP
// =====================================

const botonWhatsApp = document.getElementById("enviar-pedido");

if (botonWhatsApp) {
  botonWhatsApp.addEventListener("click", () => {

    if (productosPedido.length === 0) return;

    let mensaje = "¡Hola KingMix! Quiero consultar por este pedido:\n\n";

    let total = 0;

    productosPedido.forEach((producto) => {

      const subtotal = producto.precio * producto.cantidad;

      total += subtotal;

      mensaje += `🛒 ${producto.nombre}\n`;
      mensaje += `Presentación: ${producto.presentacion}\n`;
      mensaje += `Cantidad: ${producto.cantidad}\n`;
      mensaje += `Subtotal: $${subtotal.toLocaleString("es-AR")}\n\n`;

    });

    mensaje += `💰 TOTAL ESTIMADO: $${total.toLocaleString("es-AR")}\n\n`;
    mensaje += "Quisiera confirmar disponibilidad. ¡Gracias!";

    const telefono = "5491135046185";

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank", "noopener,noreferrer");

  });
}

  // CERRAR CON ESCAPE
  document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape" && panel.classList.contains("activo")) {
      cerrarPedido();
    }

  });

  // MANTENER EL FOCO DENTRO DEL PANEL
  panel.addEventListener("keydown", (evento) => {

    if (evento.key !== "Tab") return;

    const elementos = Array.from(
      panel.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])'
      )
    ).filter(elemento => elemento.getClientRects().length > 0);

    if (!elementos.length) return;

    const primero = elementos[0];
    const ultimo = elementos[elementos.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }

  });
// ========================================
// KINGMIX - AGREGAR ALMOHADITAS AL PEDIDO
// ========================================

const botonAgregarAlmohaditas = document.querySelector(
  '.boton-agregar-pedido[data-producto="Almohaditas"]'
);

if (botonAgregarAlmohaditas) {

  botonAgregarAlmohaditas.addEventListener("click", () => {

    const selector = document.getElementById("presentacion-almohaditas");
    const inputCantidad = document.getElementById("cantidad-almohaditas");

    const opcion = selector.options[selector.selectedIndex];

    const presentacion = opcion.value;
    const precio = Number(opcion.dataset.precio);
    const cantidad = Number(inputCantidad.value);

    if (!presentacion) {
      alert("Seleccioná una presentación.");
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      alert("Ingresá una cantidad válida.");
      return;
    }

    const subtotal = precio * cantidad;

agregarProducto(
  "Almohaditas",
  presentacion + " g",
  cantidad,
  precio
);

alert("¡Producto agregado a tu lista KingMix!");

  });

}
// ==========================================
// KINGMIX - AGREGAR NUEVOS PRODUCTOS
// ==========================================

const nuevosProductos = [
    {
        nombre: "Almendras",
        id: "almendras"
    },
    {
        nombre: "Nueces",
        id: "nueces"
    },
    {
        nombre: "Castañas de cajú",
        id: "caju"
    },
    {
        nombre: "Bananas deshidratadas",
        id: "bananas"
    },
    {
        nombre: "Maní tostado",
        id: "mani"
    },
    {
        nombre: "Pasas de uva",
        id: "pasas"
    },
    {
        nombre: "Avena Instantánea",
        id: "avena"
    },
    {
        nombre: "Grana de Maní",
        id: "grana"
    },
    {
        nombre: "Semillas de Chía",
        id: "chia"
    },
    {
        nombre: "Semillas de Girasol",
        id: "girasol"
    },
    {
        nombre: "Semillas de Sésamo Blanco",
        id: "sesamo"
    },
    {
        nombre: "Semillas de Zapallo",
        id: "zapallo"
    },
  {
    nombre: "Barritas Proteicas Entrenuts",
    id: "barritas"
},
{
    nombre: "Mix Deportivo",
    id: "deportivo"
},
{
    nombre: "Mix Brasilero",
    id: "brasilero"
},
{
    nombre: "Mix Especial",
    id: "especial"
},
{
    nombre: "Mix Deluxe",
    id: "deluxe"
},
{
    nombre: "Mix Semillas",
    id: "semillas"
},
{
    nombre: "Granola Energética",
    id: "granola"
},
{
    nombre: "Granola Rústica",
    id: "rustica"
}
];





nuevosProductos.forEach(producto => {

    const boton = document.querySelector(
        `.boton-agregar-pedido[data-producto="${producto.nombre}"]`
    );

    if (!boton) return;

    boton.addEventListener("click", () => {

        const selector = document.getElementById(
            `presentacion-${producto.id}`
        );

        const inputCantidad = document.getElementById(
            `cantidad-${producto.id}`
        );

        if (!selector || !inputCantidad) return;

        const opcion = selector.options[selector.selectedIndex];

        const presentacion = opcion.value;
        const precio = Number(opcion.dataset.precio);
        const cantidad = Number(inputCantidad.value);

        if (!presentacion) {
            alert("Seleccioná una presentación.");
            return;
        }

        if (!Number.isFinite(precio) || precio <= 0) {
            alert("No se pudo obtener el precio del producto.");
            return;
        }

        if (!Number.isInteger(cantidad) || cantidad < 1) {
            alert("Ingresá una cantidad válida.");
            return;
        }

     let nombreProducto = producto.nombre;

if (producto.id === "mani") {

    const variedad = document.getElementById("variedad-mani").value;

    if (!variedad) {
        alert("Seleccioná si querés maní con sal o sin sal.");
        return;
    }

    nombreProducto = "Maní tostado " + variedad;
}

agregarProducto(
    nombreProducto,
    presentacion + " g",
    cantidad,
    precio
);

        alert("¡Producto agregado a tu pedido KingMix!");

    });

});
});