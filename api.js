const API_URL = 'https://amiens-back.onrender.com';

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
    }
};

window.api = api;

/*
--TODO LO QUE HAY QUE HACER EN EL FRONTEND--
1 HACER LA PAGINA RESPONSIVE
2 HACER QUE EL SELECT DEL MODAL DE ME DEJE ESCRIBIR EN EL
--HECHO-- 3 ARREGLAR EL MODAL DE EXTRACCIONES QUE NO SE CERRABA AL HACER CLICK FUERA 
--hecho-- 4 HACER QUE EL MODAL DE EXTRACCIONES SE CERRARA AL HACER CLICK EN LA X
--hecho--5 ACHICAR LAS TABLAS PARA CELULAR
--hecho--6 AGREGAR EL BOTON DE ELIMINAR TANTO A LOS PRODUCTOS COMO A LAS EXTRACCIONES
7 FOMULARIO LOGIN Y DAR ROLES A LOS USUARIOS
8 Update extraccion
*/ 
