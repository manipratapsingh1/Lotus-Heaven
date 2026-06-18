export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  capacity: number;
  size: number;
  amenities: string[];
  images: RoomImage[];
  available: boolean;
  rating?: number | null;
  reviewCount: number;
  floor?: number | null;
  hotel?: Hotel;
}

export interface RoomImage {
  id: string;
  roomId: string;
  url: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating?: number | null;
  rooms?: Room[];
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string | null;
  createdAt: string;
  room?: Room;
}

export interface Payment {
  id: string;
  bookingId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  booking?: Booking;
}

export interface Review {
  id: string;
  userId: string;
  roomId: string;
  bookingId?: string | null;
  rating: number;
  title: string;
  comment?: string | null;
  verifiedStay: boolean;
  createdAt: string;
  user?: { id: string; fullName: string | null; avatarUrl: string | null };
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'GUEST' | 'HOST' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  verified: boolean;
  createdAt: string;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
