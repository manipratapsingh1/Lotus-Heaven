import axios from 'axios';

// ==================== BASE URL ====================
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ==================== AXIOS INSTANCE ====================
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies (VERY IMPORTANT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    // Auto refresh token on 401 (except auth routes)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await api.post('/auth/refresh', { refreshToken }, {
          headers: {
            'x-refresh-token': refreshToken || '',
          },
        });
        
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    api.post('/auth/register', data).then((res) => res.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((res) => res.data),

  logout: () =>
    api.post('/auth/logout').then((res) => res.data),

  getProfile: () =>
    api.get('/auth/me').then((res) => res.data),

  refreshTokens: () =>
    api.post('/auth/refresh').then((res) => res.data),
};

// ==================== ROOMS API ====================
export const roomsApi = {
  getAll: (params?: any) =>
    api.get('/rooms', { params }).then((res) => res.data),

  getOne: (id: string) =>
    api.get(`/rooms/${id}`).then((res) => res.data),

  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    api.get(`/rooms/${id}/availability`, {
      params: { checkIn, checkOut },
    }).then((res) => res.data),

  create: (data: any) =>
    api.post('/rooms', data).then((res) => res.data),

  update: (id: string, data: any) =>
    api.put(`/rooms/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/rooms/${id}`).then((res) => res.data),
};

// ==================== HOTELS API ====================
export const hotelsApi = {
  getAll: () =>
    api.get('/hotels').then((res) => res.data),

  getOne: (id: string) =>
    api.get(`/hotels/${id}`).then((res) => res.data),
};

// ==================== BOOKINGS API ====================
export const bookingsApi = {
  create: (data: any) =>
    api.post('/bookings', data).then((res) => res.data),

  getAll: () =>
    api.get('/bookings').then((res) => res.data),

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

  verifyPayment: (data: any) =>
    api.post('/payments/verify', data).then((res) => res.data),

  getHistory: () =>
    api.get('/payments/history').then((res) => res.data),

  refund: (paymentId: string) =>
    api.post(`/payments/${paymentId}/refund`).then((res) => res.data),
};

// ==================== REVIEWS API ====================
export const reviewsApi = {
  create: (data: any) =>
    api.post('/reviews', data).then((res) => res.data),

  getByRoom: (roomId: string) =>
    api.get(`/reviews/room/${roomId}`).then((res) => res.data),

  getMyReviews: () =>
    api.get('/reviews/me').then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/reviews/${id}`).then((res) => res.data),
};

// ==================== USERS API ====================
export const usersApi = {
  getAll: () =>
    api.get('/users').then((res) => res.data),

  getOne: (id: string) =>
    api.get(`/users/${id}`).then((res) => res.data),

  updateProfile: (data: any) =>
    api.put('/users/profile', data).then((res) => res.data),

  getStats: () =>
    api.get('/users/stats').then((res) => res.data),
};