import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send httpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    // If 401 and we haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — let calling code handle it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ==================== AUTH API ====================

export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    api.post('/auth/register', data).then((res) => res.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((res) => res.data),

  logout: () => api.post('/auth/logout').then((res) => res.data),

  getProfile: () => api.get('/auth/me').then((res) => res.data),

  refreshTokens: () => api.post('/auth/refresh').then((res) => res.data),
};

// ==================== ROOMS API ====================

export interface SearchParams {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  limit?: number;
}

export const roomsApi = {
  getAll: (params?: SearchParams) =>
    api.get('/rooms', { params }).then((res) => res.data),

  getOne: (id: string) => api.get(`/rooms/${id}`).then((res) => res.data),

  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    api
      .get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } })
      .then((res) => res.data),

  create: (data: any) => api.post('/rooms', data).then((res) => res.data),

  update: (id: string, data: any) =>
    api.put(`/rooms/${id}`, data).then((res) => res.data),

  delete: (id: string) => api.delete(`/rooms/${id}`).then((res) => res.data),
};

// ==================== HOTELS API ====================

export const hotelsApi = {
  getAll: () => api.get('/hotels').then((res) => res.data),

  getOne: (id: string) => api.get(`/hotels/${id}`).then((res) => res.data),
};

// ==================== BOOKINGS API ====================

export const bookingsApi = {
  create: (data: {
    roomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  }) => api.post('/bookings', data).then((res) => res.data),

  getAll: () => api.get('/bookings').then((res) => res.data),

  getOne: (id: string) =>
    api.get(`/bookings/${id}`).then((res) => res.data),

  updateStatus: (id: string, status: string) =>
    api.put(`/bookings/${id}/status`, { status }).then((res) => res.data),

  getAnalytics: () =>
    api.get('/bookings/analytics').then((res) => res.data),
};

// ==================== PAYMENTS API ====================

export const paymentsApi = {
  createOrder: (bookingId: string) =>
    api.post(`/payments/checkout/${bookingId}`).then((res) => res.data),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post('/payments/verify', data).then((res) => res.data),

  getHistory: () => api.get('/payments/history').then((res) => res.data),

  refund: (paymentId: string) =>
    api.post(`/payments/${paymentId}/refund`).then((res) => res.data),
};

// ==================== REVIEWS API ====================

export const reviewsApi = {
  create: (data: {
    roomId: string;
    bookingId?: string;
    title: string;
    rating: number;
    comment?: string;
  }) => api.post('/reviews', data).then((res) => res.data),

  getByRoom: (roomId: string) =>
    api.get(`/reviews/room/${roomId}`).then((res) => res.data),

  getMyReviews: () => api.get('/reviews/me').then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/reviews/${id}`).then((res) => res.data),
};

// ==================== USERS API ====================

export const usersApi = {
  getAll: () => api.get('/users').then((res) => res.data),

  getOne: (id: string) => api.get(`/users/${id}`).then((res) => res.data),

  updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
    api.put('/users/profile', data).then((res) => res.data),

  getStats: () => api.get('/users/stats').then((res) => res.data),
};
