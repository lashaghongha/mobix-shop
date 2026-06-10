import axios from 'axios';

// Dev: proxied via Vite → localhost:5273
// Prod: set VITE_API_URL=https://your-app.railway.app in Vercel env vars
const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const api = {
  getProducts: (params) => axios.get(`${BASE}/products`, { params }),
  getProduct: (id) => axios.get(`${BASE}/products/${id}`),
  getFeatured: () => axios.get(`${BASE}/products/featured`),
  getDeals: () => axios.get(`${BASE}/products/deals`),
  getCategories: () => axios.get(`${BASE}/categories`),
  getCart: (sessionId) => axios.get(`${BASE}/cart/${sessionId}`),
  addToCart: (data) => axios.post(`${BASE}/cart`, data),
  updateCart: (id, qty) => axios.put(`${BASE}/cart/${id}`, qty),
  removeFromCart: (id) => axios.delete(`${BASE}/cart/${id}`),
  createOrder: (data) => axios.post(`${BASE}/orders`, data),
  getOrder: (id) => axios.get(`${BASE}/orders/${id}`),

  // Admin
  adminStats: () => axios.get(`${BASE}/admin/stats`),
  adminGetOrders: (params) => axios.get(`${BASE}/admin/orders`, { params }),
  adminGetOrder: (id) => axios.get(`${BASE}/admin/orders/${id}`),
  adminUpdateOrderStatus: (id, status) => axios.patch(`${BASE}/admin/orders/${id}/status`, { status }),
  adminGetProducts: (params) => axios.get(`${BASE}/admin/products`, { params }),
  adminCreateProduct: (data) => axios.post(`${BASE}/admin/products`, data),
  adminUpdateProduct: (id, data) => axios.put(`${BASE}/admin/products/${id}`, data),
  adminDeleteProduct: (id) => axios.delete(`${BASE}/admin/products/${id}`),
  adminTogglePublish: (id) => axios.patch(`${BASE}/admin/products/${id}/publish`),
  adminGetCategories: () => axios.get(`${BASE}/admin/categories`),
  adminCreateCategory: (data) => axios.post(`${BASE}/admin/categories`, data),
  adminUpdateCategory: (id, data) => axios.put(`${BASE}/admin/categories/${id}`, data),
  adminDeleteCategory: (id) => axios.delete(`${BASE}/admin/categories/${id}`),

  // Users
  adminGetUsers: (params) => axios.get(`${BASE}/admin/users`, { params }),
  adminGetUser:  (email) => axios.get(`${BASE}/admin/users/${encodeURIComponent(email)}`),

  // Benefits
  get:    (path) => axios.get(`${BASE}${path}`),
  post:   (path, data) => axios.post(`${BASE}${path}`, data),
  put:    (path, data) => axios.put(`${BASE}${path}`, data),
  delete: (path) => axios.delete(`${BASE}${path}`),

  // Upload
  adminUploadImage: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return axios.post(`${BASE}/admin/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
