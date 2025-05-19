const API_URL = 'https://amiens-back-1.onrender.com'; 
//const API_URL = 'http://localhost:5000'; 
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

async function handleApiResponse(response) {
    const data = await response.json();
    
    if (data.error === "El token ha expirado") {
        showToast(data.mensaje || 'La sesión ha expirado', 'error');
        cerrarSesion();
        throw new Error('Token expirado'); // Para detener la ejecución
    }
    
    if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
    }
    
    return data;
};

const api = {

    verifyToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await fetch(`${API_URL}/islogged`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            console.log('Response from /islogged:', response);

            return response.ok;
        } catch (error) {
            console.error('Error verifying token:', error);
            return false;
        }
    },

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
            } else {
                const data = await response.json();
                localStorage.setItem('token', data.access_token); // Almacena el token en localStorage
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
            const response = await fetch(`${API_URL}/productos`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error fetching productos:', error);
            throw error;
        }
    },

    createProducto: async (data) => {
        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error creating producto:', error);
            throw error;
        }
    },

    updateProducto: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error updating producto:', error);
            throw error;
        }
    },

    deleteProducto: async (id) => {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error deleting producto:', error);
            throw error;
        }
    },

    // Nuevas funciones para extracciones
    fetchExtracciones: async () => {
        try {
            const response = await fetch(`${API_URL}/extracciones?_embed=detalles`,
                {
                    method: 'GET',
                    headers: getAuthHeaders()
                }
            );
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error fetching extracciones:', error);
            throw error;
        }
    },

    createExtraccion: async (data) => {
        try {
            const response = await fetch(`${API_URL}/extracciones`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error creating extraccion:', error);
            throw error;
        }
    },

    deleteExtraccion: async (id, data = {}) => {
        try {
            const response = await fetch(`${API_URL}/extracciones/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error deleting extraccion:', error);
            throw error;
        }
    },

    // Funciones para ingresos
    fetchIngresos: async () => {
        try {
            const response = await fetch(`${API_URL}/ingresos`,
                {
                    method: 'GET',
                    headers: getAuthHeaders()
                }
            );
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error fetching ingresos:', error);
            throw error;
        }
    },

    createIngreso: async (data) => {
        try {
            const response = await fetch(`${API_URL}/ingresos`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error creating ingreso:', error);
            throw error;
        }
    },

    deleteIngreso: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/ingresos/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error deleting ingreso:', error);
            throw error;
        }
    },

    getUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios`,
                {
                    method: 'GET',
                    headers: getAuthHeaders()
                }
            );
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            throw error;
        }
    }
};

window.cerrarSesion = () => {
    const boton = document.getElementById('btn-iniciar-sesion');
    boton.disabled = false;
    boton.textContent = 'Iniciar sesión';
    boton.style.cursor = 'pointer';
    boton.style.backgroundColor = '#3498db';
    localStorage.removeItem('token')
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
};

window.api = api;


