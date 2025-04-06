
// app.js
// Variables globales
let todosProductos = [];  // Almacena todos los productos
let todasExtracciones = []; // Almacena todas las extracciones
let timeoutBusqueda; // Para el debounce de búsqueda
let currentTab = 'productos'; // Pestaña activa
let productosParaExtraccion = []; // Almacena productos seleccionados para la extracción
let extraccionEditando = null; // Almacena la extracción que se está editando
let productoAgregar = null; // Almacena el producto seleccionado para agregar a la extracción


let inputBuscador = document.getElementById('buscador-productos-extraccion');

const searchInput = document.getElementById('search-input');


// Sistema de pestañas
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = tab.id === `${tabName}-tab` ? 'block' : 'none';
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    if (tabName === 'productos') loadProductos();
    if (tabName === 'extracciones') loadExtracciones();
}

// Módulo de Productos (existente)
async function loadProductos() {
    try {
        todosProductos = await api.fetchProductos();
        todosProductos = ordenarProductosPorDescripcion(); // Ordenar productos por descripción
        renderizarProductos(todosProductos);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function ordenarProductosPorDescripcion() {
    return todosProductos.sort((a, b) => {
        const descA = a.descripcion.toLowerCase();
        const descB = b.descripcion.toLowerCase();
        return descA.localeCompare(descB);
    });
}

function renderizarProductos(productos) {
    const tbody = document.getElementById('productos-lista');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const estado = producto.estado || 'N/A';
        const estadoClass = estado.toLowerCase().replace(' ', '-');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${producto.descripcion}</td>
            <td>${producto.categoria}</td>
            <td>${producto.proveedor || 'N/A'}</td>
            <td>${producto.stock}</td>
            <td>${producto.stock_minimo}</td>
            <td class="${estadoClass}">${estado}</td>
        `;
        tbody.appendChild(row);
        row.addEventListener('click', () => prepararEdicion(producto));
    });
}

function filtrarProductosExtracion() {
    const termino = document.getElementById('buscador-productos-extraccion').value.toLowerCase();
    const filtrados = todosProductos.filter(p => {
        // Filtro por texto de búsqueda
        const coincideTexto =
            p.descripcion.toLowerCase().includes(termino) ||
            (p.categoria && p.categoria.toLowerCase().includes(termino)) ||
            (p.proveedor && p.proveedor.toLowerCase().includes(termino));

        // Filtro por estado
        const coincideEstado =
            estadoSeleccionado === 'todos' ||
            (p.estado && p.estado.toLowerCase().replace(' ', '-') === estadoSeleccionado);

        return coincideTexto && coincideEstado;
    });
    renderizarProductosExtraccion(filtrados);
}

function renderizarProductosExtraccion(productos) {
    const listaResultados = document.getElementById('resultados-productos-extraccion');

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto.nombre;

        li.addEventListener('click', () => {
            inputBuscador.value = producto.nombre;
            listaResultados.innerHTML = ''; // Oculta los resultados
            // 👇 Llamá tu función acá
            productoAgregar = producto; // Guardar el producto seleccionado
        });

        listaResultados.appendChild(li);
    });
}


function filtrarProductos() {
    const termino = document.getElementById('buscador-productos').value.toLowerCase();
    const estadoSeleccionado = document.getElementById('verificarStock').value;

    const filtrados = todosProductos.filter(p => {
        // Filtro por texto de búsqueda
        const coincideTexto =
            p.descripcion.toLowerCase().includes(termino) ||
            (p.categoria && p.categoria.toLowerCase().includes(termino)) ||
            (p.proveedor && p.proveedor.toLowerCase().includes(termino));

        // Filtro por estado
        const coincideEstado =
            estadoSeleccionado === 'todos' ||
            (p.estado && p.estado.toLowerCase().replace(' ', '-') === estadoSeleccionado);

        return coincideTexto && coincideEstado;
    });

    renderizarProductos(filtrados);
}


/*------------------------------*/
/*FUNCIONES DE PRODUCTOS*/
/*------------------------------*/

function prepararEdicion(producto) {
    // Llenar modal con datos del producto seleccionado
    document.getElementById('modal-title').textContent = producto.descripcion;
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('categoria').value = producto.categoria;
    document.getElementById('proveedor').value = producto.proveedor || '';
    document.getElementById('stock').value = producto.stock;
    document.getElementById('stock_minimo').value = producto.stock_minimo;

    document.getElementById('producto-modal').style.display = 'block';
}

function mostrarFormularioProducto(producto = null) {
    const modal = document.getElementById('producto-modal');
    const form = document.getElementById('producto-form');
    const title = document.getElementById('modal-title');

    // Configurar el modal según si es nuevo o edición
    if (producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('stock_minimo').value = producto.stock_minimo;
        document.getElementById('proveedor').value = producto.proveedor || '';
        document.getElementById('categoria').value = producto.categoria || '';
    } else {
        title.textContent = 'Nuevo Producto';
        form.reset();
    }

    modal.style.display = 'block';
}

// Función para guardar el producto (nuevo o editado)
async function guardarProducto(event) {
    event.preventDefault();
    let productoId = document.getElementById('producto-id').value;
    console.log(productoId);
    try {
        if (productoId) {
            const productoData = {
                id: parseInt(document.getElementById('producto-id').value),
                descripcion: document.getElementById('descripcion').value,
                stock: parseInt(document.getElementById('stock').value),
                stock_minimo: parseInt(document.getElementById('stock_minimo').value),
                proveedor: document.getElementById('proveedor').value || '-',
                categoria: document.getElementById('categoria').value || '-'
            };
            await api.updateProducto(productoData.id, productoData);
        } else {
            const productoDataSinID = {
                descripcion: document.getElementById('descripcion').value,
                stock: parseInt(document.getElementById('stock').value),
                stock_minimo: parseInt(document.getElementById('stock_minimo').value),
                proveedor: document.getElementById('proveedor').value || '-',
                categoria: document.getElementById('categoria').value || '-'
            };
            await api.createProducto(productoDataSinID);
        }

        cerrarModal();
        await loadProductos(); // Recargar la lista
    } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Error al guardar el producto');
    }
}

async function eliminarProducto(event) {
    event.preventDefault();
    let productoId = document.getElementById('producto-id').value;
    console.log(productoId);
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            await api.deleteProducto(productoId);
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error al eliminar el producto');
        }
    }
    cerrarModal();
    await loadProductos(); // Recargar la lista
}

// Función para cerrar el modal
function cerrarModal() {
    if (currentTab === 'productos') {
        document.getElementById('producto-modal').style.display = 'none';
        document.getElementById('producto-id').value = '';
    } else {
        document.getElementById('extraccion-modal').style.display = 'none';
        extraccionEditando = null;
    }

}

/*-----------------------*/
/*FUNCIONES EXTRACCIONES*/
/*-----------------------*/

async function loadExtracciones() {
    try {
        todasExtracciones = await api.fetchExtracciones();
        renderizarExtracciones(todasExtracciones);
    } catch (error) {
        console.error('Error cargando extracciones:', error);
    }
}

function filtrarExtracciones() {
    const termino = document.getElementById('buscador-extracciones').value.toLowerCase();
    const filtroFecha = document.getElementById('filtroFecha').value;
    const hoy = new Date();

    const filtradas = todasExtracciones.filter(e => {
        // Filtro por texto
        const coincideTexto = e.descripcion.toLowerCase().includes(termino)

        // Filtro por fecha
        const fechaExtraccion = new Date(e.fecha);
        let coincideFecha = true;

        if (filtroFecha === 'hoy') {
            coincideFecha = fechaExtraccion.toDateString() === hoy.toDateString();
        } else if (filtroFecha === 'semana') {
            const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
            coincideFecha = fechaExtraccion >= inicioSemana;
        } else if (filtroFecha === 'mes') {
            coincideFecha = fechaExtraccion.getMonth() === hoy.getMonth() &&
                fechaExtraccion.getFullYear() === hoy.getFullYear();
        }

        return coincideTexto && coincideFecha;
    });
    console.log(filtradas);
    renderizarExtracciones(filtradas);
}

function renderizarExtracciones(extracciones) {
    const tbody = document.getElementById('extracciones-lista');
    tbody.innerHTML = '';

    extracciones.forEach(extraccion => {
        const row = document.createElement('tr');
        const fecha = new Date(extraccion.fecha).toLocaleDateString();
        const totalItems = extraccion.detalles.reduce((sum, d) => sum + d.cantidad, 0);
        const productos = extraccion.detalles.map(d => todosProductos.find(p => p.id === d.producto_id)?.descripcion || `Producto ${d.producto_id}`).join(', ');
        row.innerHTML = `
            <td>${fecha}</td>
            <td>${extraccion.descripcion || 'Sin descripción'}</td>
            <td>${productos}</td>
            <td>${totalItems}</td>
        `;
        tbody.appendChild(row);
        row.addEventListener('click', () => abrirModalExtraccion(extraccion));
    });
}

// Función para abrir el modal
async function abrirModalExtraccion(extraccion = null) {
    extraccionEditando = extraccion;
    const modal = document.getElementById('extraccion-modal');
    const title = document.getElementById('modal-extraccion-title');


    if (extraccion) {
        title.textContent = `Extracción: ${extraccion.descripcion}`;
        document.getElementById('extraccion-descripcion-container').style.display = 'none';
        document.getElementById('agregar-producto-container').style.display = 'none';
        document.getElementById('extraccion-id').value = extraccion.id;
        productosParaExtraccion = extraccion.detalles.map(d => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            producto_descripcion: d.producto_descripcion || `Producto ${d.producto_id}`,
            stock: d.producto_stock || 0
        }));
        document.getElementById('acciones-header').style.display = 'none';
        document.getElementById('guardar-extraccion').style.display = 'none';
    } else {
        title.textContent = 'Nueva Extracción';
        document.getElementById('extraccion-descripcion-container').style.display = 'block';
        document.getElementById('agregar-producto-container').style.display = 'block';
        document.getElementById('acciones-header').style.display = 'block';
        document.getElementById('guardar-extraccion').style.display = 'block';
        document.getElementById('extraccion-descripcion').value = '';
        productosParaExtraccion = [];
    }

    renderizarProductosEnExtraccion();
    modal.style.display = 'block';
}



// Renderizar productos en la tabla
function renderizarProductosEnExtraccion() {
    const tbody = document.getElementById('productos-extraccion-lista');
    tbody.innerHTML = '';

    productosParaExtraccion.forEach(item => {
        const producto = todosProductos.find(p => p.id === item.producto_id) || {};
        const tr = document.createElement('tr');
        const sinStock = producto.stock < item.cantidad;

        const accionesHTML = extraccionEditando
            ? '' // Si estás editando, no mostramos acciones
            : `
                <td>
                    <button class="btn-eliminar-producto" data-id="${item.producto_id}">Eliminar</button>
                    <button class="btn-editar-cantidad" data-id="${item.producto_id}">Editar</button>
                </td>
            `;

        tr.innerHTML = `
            <td>${producto.descripcion}</td>
            <td>${item.cantidad}</td>
            <td class="${sinStock ? 'sin-stock-suficiente' : ''}">
                ${producto.stock !== undefined ? producto.stock : 'N/A'}
            </td>
            ${accionesHTML}
        `;

        tbody.appendChild(tr);
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productoId = parseInt(btn.dataset.id);
            productosParaExtraccion = productosParaExtraccion.filter(p => p.producto_id !== productoId);
            renderizarProductosEnExtraccion();
        });
    });

    document.querySelectorAll('.btn-editar-cantidad').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productoId = parseInt(btn.dataset.id);
            const producto = productosParaExtraccion.find(p => p.producto_id === productoId);
            const nuevaCantidad = prompt('Ingrese nueva cantidad:', producto.cantidad);

            if (nuevaCantidad && !isNaN(nuevaCantidad)) {
                producto.cantidad = parseInt(nuevaCantidad);
                renderizarProductosEnExtraccion();
            }
        });
    });
}

// Guardar extracción
async function guardarExtraccion() {
    const descripcion = document.getElementById('extraccion-descripcion').value;

    if (!descripcion) {
        alert('Por favor ingrese una descripción');
        return;
    }

    if (productosParaExtraccion.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
    }

    const data = {
        descripcion,
        productos: productosParaExtraccion.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad
        }))
    };

    try {
        if (extraccionEditando) {
            await api.updateExtraccion(extraccionEditando.id, data);
        } else {
            await api.createExtraccion(data);
        }

        cerrarModal();
        await loadExtracciones();
    } catch (error) {
        console.error('Error guardando extracción:', error);
        alert('Error al guardar la extracción: ' + (error.message || 'Verifique los datos'));
    }
}

// Eliminar extracción (desde la lista principal)
async function eliminarExtraccion(event) {
    const extraccionId = document.getElementById('extraccion-id').value;
    if (confirm('¿Está seguro de que desea eliminar esta extracción?')) {
        if (confirm('¿Quiere devolver los productos a stock?')) {
            data = { 'devolver': 1 };
        } else {
            data = { 'devolver': 0 };
        }
        try {
            await api.deleteExtraccion(extraccionId, data);
            await loadExtracciones(); // Recargar la lista
            alert('Extracción eliminada correctamente');
        } catch (error) {
            console.error('Error eliminando extracción:', error);
            alert('Error al eliminar la extracción: ' + (error.message || 'Intente nuevamente'));
        }
    }
    cerrarModal();
    await loadExtracciones(); // Recargar la lista

}

// Función para agregar producto
function agregarProductoAExtraccion() {
    const input = document.getElementById('search-input');
    const cantidadInput = document.getElementById('producto-cantidad');
    const productoId = productoAgregar.id; // Asumiendo que productoAgregar es el objeto del producto seleccionado
    const cantidad = parseInt(cantidadInput.value);

    if (!productoId || isNaN(cantidad) || cantidad <= 0) {
        alert('Seleccione un producto y una cantidad válida');
        return;
    }

    const producto = todosProductos.find(p => p.id === productoId);

    // Verificar si ya existe
    const existeIndex = productosParaExtraccion.findIndex(p => p.producto_id === productoId);

    if (existeIndex >= 0) {
        // Actualizar cantidad si ya existe
        productosParaExtraccion[existeIndex].cantidad += cantidad;
    } else {
        // Agregar nuevo
        productosParaExtraccion.push({
            producto_id: productoId,
            cantidad: cantidad,
            producto_descripcion: producto.descripcion,
            stock: producto.stock
        });
    }

    renderizarProductosEnExtraccion();
    input.value = '';
    cantidadInput.value = 1;
}



// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Sistema de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    /*------------------------------*/
    //BUSCADOR , SELECT y nuevo producto
    // Búsqueda en tiempo real
    document.getElementById('buscador-productos').addEventListener('input', () => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(filtrarProductos, 300);
    });

    // select para ver productos con stock
    document.getElementById('verificarStock').addEventListener('change', () => {
        document.getElementById('buscador-productos').value = ''; // Limpiar el input de búsqueda
        filtrarProductos()
    });

    // Resetear el select a "todos" cuando se escribe
    document.getElementById('buscador-productos').addEventListener('input', () => {
        document.getElementById('verificarStock').value = 'todos';
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(filtrarProductos, 300);
    });

    // Botón nuevo producto
    document.getElementById('btn-nuevo-producto').addEventListener('click', () => {
        mostrarFormularioProducto();
    });

    //MODAL PRODUCTO
    //Botón guardar
    document.getElementById('producto-form').addEventListener('submit', guardarProducto);
    // Botón cancelar
    document.getElementById('cancelar-form').addEventListener('click', cerrarModal);
    // Cerrar al hacer clic en la X
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    //Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('producto-modal');
        if (event.target === modal) {
            cerrarModal();
        }
        const modalExtraccion = document.getElementById('extraccion-modal');
        if (event.target === modalExtraccion) {
            cerrarModal();
        }
    });
    document.getElementById('btn-eliminar-producto').addEventListener('click', eliminarProducto);

    /*-----------------*/
    //eventos EXTRACCIONES
    /*-----------------*/
    document.getElementById('filtroFecha').addEventListener('change', filtrarExtracciones);

    document.getElementById('buscador-extracciones').addEventListener('input', () => {
        document.getElementById('filtroFecha').value = 'todos';
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(filtrarExtracciones, 300);
    });

    /*MODAL EXTRACCIONES*/
    document.getElementById('btn-nueva-extraccion').addEventListener('click', () => abrirModalExtraccion());
    document.getElementById('btn-agregar-producto').addEventListener('click', agregarProductoAExtraccion);
    document.getElementById('guardar-extraccion').addEventListener('click', guardarExtraccion);
    document.getElementById('cancelar-extraccion').addEventListener('click', cerrarModal);
    document.getElementById("btn-eliminar-producto-extraccion").addEventListener('click', eliminarExtraccion);
    document.getElementById('close-modal-extraccion').addEventListener('click', cerrarModal);

    // Para editar desde la lista principal (añadir en DOMContentLoaded)
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.btn-editar-extraccion')) {
            const extraccionId = parseInt(e.target.closest('.btn-editar-extraccion').dataset.id);
            const extraccion = todasExtracciones.find(e => e.id === extraccionId);

            if (extraccion) {
                // Necesitamos cargar los detalles completos si no están
                if (!extraccion.detalles || extraccion.detalles.length === 0) {
                    const response = await fetch(`${API_URL}/extracciones/${extraccionId}`);
                    const data = await response.json();
                    extraccion.detalles = data.detalles;
                }

                await abrirModalExtraccion(extraccion);
            }
        }
    });



    // Cargar pestaña inicial
    switchTab('productos');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {
            const suggestionsList = document.getElementById('suggestions-list');
            suggestionsList.innerHTML = '';
            return;
        }

        const filtered = todosProductos.filter(producto =>
            producto.descripcion.toLowerCase().includes(query)
        );

        renderSuggestions(filtered);
    });
});




// Ejemplo de array de productos. En tu caso, lo obtendrías desde la API o tu fuente de datos.


// Función para renderizar las sugerencias filtradas
function renderSuggestions(filteredProducts) {
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';

    filteredProducts.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto.descripcion;

        // Al hacer click se completa el input y se ejecuta la acción deseada
        li.addEventListener('click', () => {
            searchInput.value = producto.descripcion;
            suggestionsList.innerHTML = ''; // Oculta el dropdown


            productoAgregar = producto; // Guardar el producto seleccionado
        });

        suggestionsList.appendChild(li);
    });
}

// Evento para filtrar a medida que el usuario escribe


// Función que se ejecuta al seleccionar un producto

