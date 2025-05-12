const API_URL = 'https://amiens-back-1.onrender.com'; // Cambia esto por la URL de tu API si es diferente

const api = {

    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }else{
                const data = await response.json();
                localStorage.setItem('usuario', data.usuario_id); // Almacena el token en localStorage
                return data;
            }
            // Podés almacenar el ID en localStorage si lo necesitás
            // localStorage.setItem('usuario_id', data.usuario_id);
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
        }
    },

    // Funciones de productos (existente)
    fetchProductos: async () => {
        try {
            const response = await fetch(`${API_URL}/productos`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching productos:', error);
            throw error;
        }
    },

    createProducto: async (data) => {
        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating producto:', error);
            throw error;
        }
    },

    updateProducto: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating producto:', error);
            throw error;
        }
    },

    deleteProducto: async (id) => {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting producto:', error);
            throw error;
        }
    },

    // Nuevas funciones para extracciones
    fetchExtracciones: async () => {
        try {
            const response = await fetch(`${API_URL}/extracciones?_embed=detalles`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching extracciones:', error);
            throw error;
        }
    },

    createExtraccion: async (data) => {
        try {
            const response = await fetch(`${API_URL}/extracciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating extraccion:', error);
            throw error;
        }
    },

    deleteExtraccion: async (id, data = {}) => {
        try {
            const response = await fetch(`${API_URL}/extracciones/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting extraccion:', error);
            throw error;
        }
    },

    // Funciones para ingresos
    fetchIngresos: async () => {
        try {
            const response = await fetch(`${API_URL}/ingresos`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching ingresos:', error);
            throw error;
        }
    },

    createIngreso: async (data) => {
        try {
            const response = await fetch(`${API_URL}/ingresos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating ingreso:', error);
            throw error;
        }
    },

    deleteIngreso: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/ingresos/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting ingreso:', error);
            throw error;
        }
    },

    updateIngreso: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/ingresos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating ingreso:', error);
            throw error;
        }
    },

    getUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            throw error;
        }
    }
};

window.api = api;


