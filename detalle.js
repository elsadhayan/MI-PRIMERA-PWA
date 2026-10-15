const imagenes = [
    { id: 0, titulo: "Café 1", imagen: "imagenes/cafe1.jpg", descripcion: "Delicioso café con notas dulces y un tostado medio suave." },
    { id: 1, titulo: "Café 2", imagen: "imagenes/cafe2.jpg", descripcion: "Café de alta montaña con aroma intenso y cuerpo cremoso." },
    { id: 2, titulo: "Café 3", imagen: "imagenes/cafe3.jpg", descripcion: "Espresso tradicional con capa de crema densa y equilibrada." },
    { id: 3, titulo: "Café 4", imagen: "imagenes/cafe4.jpg", descripcion: "Mezcla artesanal con toques de chocolate y frutos secos." },
    { id: 4, titulo: "Café 5", imagen: "imagenes/cafe5.jpg", descripcion: "Café orgánico de grano entero recién molido." },
    { id: 5, titulo: "Café 6", imagen: "imagenes/cafe6.jpg", descripcion: "Cappuccino cremoso con un toque suave de canela." },
    { id: 6, titulo: "Café 7", imagen: "imagenes/cafe7.jpg", descripcion: "Infusión en frío con sabor refrescante y baja acidez." },
    { id: 7, titulo: "Café 8", imagen: "imagenes/cafe8.jpg", descripcion: "Café tostado oscuro con cuerpo robusto y profundo." },
    { id: 8, titulo: "Café 9", imagen: "imagenes/cafe9.jpg", descripcion: "Café descafeinado mediante proceso natural de agua." },
    { id: 9, titulo: "Café 10", imagen: "imagenes/cafe10.jpg", descripcion: "Edición especial con notas cítricas y fragancia frutal." }
];

document.addEventListener("DOMContentLoaded", () => {
    // Capturar el ID de la URL
    const params = new URLSearchParams(window.location.search);
    const cafeId = params.get('id');

    console.log("ID obtenido de la URL:", cafeId);

    // Buscar coincidencia ignorando si es texto o número
    const cafeSeleccionado = imagenes.find(item => String(item.id) === String(cafeId));

    console.log("Café encontrado:", cafeSeleccionado);

    if (cafeSeleccionado) {
        document.getElementById("cafe-img").src = cafeSeleccionado.imagen;
        document.getElementById("cafe-img").alt = cafeSeleccionado.titulo;
        document.getElementById("cafe-titulo").textContent = cafeSeleccionado.titulo;
        document.getElementById("cafe-descripcion").textContent = cafeSeleccionado.descripcion;
    } else {
        document.querySelector(".detalle-card").innerHTML = "<h2>Café no encontrado</h2>";
    }
});