import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProductos = () => api.get('/productos');
export const getProducto = (id) => api.get(`/productos/${id}`);
export const buscarProductos = (nombre) => api.get(`/productos/buscar?nombre=${nombre}`);
export const getStockBajo = () => api.get('/productos/stock-bajo');
export const crearProducto = (data) => api.post('/productos', data);
export const actualizarProducto = (id, data) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);
export const getCategorias = () => api.get('/categorias');
export const crearCategoria = (data) => api.post('/categorias', data);
export const actualizarCategoria = (id, data) => api.put(`/categorias/${id}`, data);
export const eliminarCategoria = (id) => api.delete(`/categorias/${id}`);
export const getMovimientos = () => api.get('/inventario/movimientos');
export const registrarEntrada = (data) => api.post('/inventario/entrada', data);
export const registrarSalida = (data) => api.post('/inventario/salida', data);
export const getVentas = () => api.get('/ventas');
export const getResumenVentas = () => api.get('/ventas/resumen');
export const registrarVenta = (data) => api.post('/ventas', data);
