const API_URL = 'http://localhost:5000';

const api = {
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

    deleteExtraccion: async (id) => {
        try {
            const response = await fetch(`${API_URL}/extracciones/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting extraccion:', error);
            throw error;
        }
    }
};

window.api = api;