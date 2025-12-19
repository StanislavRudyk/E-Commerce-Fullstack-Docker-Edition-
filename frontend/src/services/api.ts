import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

export const apiService = {
  getProducts: (catId?: number) => api.get('/products' + (catId ? `?category_id=${catId}` : '')),
  getCategories: () => api.get('/categories'),
  getProductById: (id: number) => api.get(`/products/${id}`),
  
  createOrder: (orderData: any) => api.post('/orders', orderData),
  getUserOrders: (email: string) => api.get(`/orders/my-orders?email=${email}`),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId: number, status: string) => api.patch(`/admin/orders/${orderId}`, { status }),
  manageProduct: {
    add: (data: any) => api.post('/products', data),
    update: (id: number, data: any) => api.put(`/products/${id}`, data),
    delete: (id: number) => api.delete(`/products/${id}`),
  }
};