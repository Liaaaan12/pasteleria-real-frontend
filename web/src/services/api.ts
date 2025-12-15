import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Servicios de autenticación
export const authService = {
  login: async (correo: string, password: string) => {
    const response = await api.post('/auth/login', { correo, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        correo: response.data.correo,
        nombre: response.data.nombre,
        apellidos: response.data.apellidos,
        tipoUsuario: response.data.tipoUsuario,
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Servicios de productos
export const productService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  getByCodigo: async (codigo: string) => {
    const response = await api.get(`/productos/codigo/${codigo}`);
    return response.data;
  },

  getByCategoria: async (categoriaId: number) => {
    const response = await api.get(`/productos/categoria/${categoriaId}`);
    return response.data;
  },

  create: async (producto: any) => {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  update: async (id: number, producto: any) => {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/productos/${id}`);
  },
};

// Servicios de categorías
export const categoriaService = {
  getAll: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  create: async (categoria: any) => {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/categorias/${id}`);
  },
};
