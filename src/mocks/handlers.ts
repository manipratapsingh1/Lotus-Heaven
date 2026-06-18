import { http, HttpResponse } from 'msw';
import demoData from './data/demo.json';

const baseUrl = '/api';

export const handlers = [
  // Rooms endpoints
  http.get(`${baseUrl}/rooms`, ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const guests = url.searchParams.get('guests');
    
    let rooms = [...demoData.rooms];
    
    // Filter by capacity if guests specified
    if (guests) {
      const guestCount = parseInt(guests);
      rooms = rooms.filter(room => room.capacity >= guestCount);
    }
    
    return HttpResponse.json(rooms);
  }),

  http.get(`${baseUrl}/rooms/:id`, ({ params }) => {
    const room = demoData.rooms.find(r => r.id === params.id);
    if (!room) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(room);
  }),

  http.get(`${baseUrl}/rooms/:id/availability`, ({ params, request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    
    // Mock availability - return booked dates
    const bookedDates = demoData.bookings
      .filter(b => b.roomId === params.id)
      .map(b => ({
        checkIn: b.checkIn,
        checkOut: b.checkOut
      }));
    
    return HttpResponse.json({
      roomId: params.id,
      available: true,
      bookedDates
    });
  }),

  // Bookings endpoints
  http.post(`${baseUrl}/bookings`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newBooking = {
      id: `B${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...body,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      qrCode: `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  http.get(`${baseUrl}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    return HttpResponse.json(demoData.bookings);
  }),

  http.put(`${baseUrl}/bookings/:id/status`, async ({ params, request }) => {
    const body = await request.json() as { status: string };
    const booking = demoData.bookings.find(b => b.id === params.id);
    
    if (!booking) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json({
      ...booking,
      status: body.status
    });
  }),

  // Admin rooms endpoints
  http.post(`${baseUrl}/admin/rooms`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newRoom = {
      id: `R${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      available: true,
      rating: 0,
      reviewCount: 0
    };
    
    return HttpResponse.json(newRoom, { status: 201 });
  }),

  http.put(`${baseUrl}/admin/rooms/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    return HttpResponse.json({
      id: params.id,
      ...body
    });
  }),

  http.delete(`${baseUrl}/admin/rooms/:id`, ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Reports endpoint
  http.get(`${baseUrl}/reports`, ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    
    return HttpResponse.json({
      totalRevenue: 12450,
      totalBookings: 45,
      occupancyRate: 78,
      averageRate: 276,
      revenueByMonth: [
        { month: 'Oct', revenue: 8500 },
        { month: 'Nov', revenue: 12450 },
        { month: 'Dec', revenue: 15300 }
      ]
    });
  }),

  // Forecast endpoint
  http.get(`${baseUrl}/forecast`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      forecast30: { occupancy: 82, revenue: 18500 },
      forecast60: { occupancy: 75, revenue: 35000 },
      forecast90: { occupancy: 78, revenue: 52000 }
    });
  }),

  // QR check-in endpoint
  http.post(`${baseUrl}/checkin/qr/verify`, async ({ request }) => {
    const body = await request.json() as { qrCode: string };
    const booking = demoData.bookings.find(b => b.qrCode === body.qrCode);
    
    if (!booking) {
      return HttpResponse.json({ valid: false }, { status: 404 });
    }
    
    return HttpResponse.json({
      valid: true,
      booking
    });
  }),

  // Search endpoint
  http.get(`${baseUrl}/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() || '';
    
    const results = {
      rooms: demoData.rooms.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q)
      ),
      bookings: demoData.bookings.filter(b => 
        b.guestName.toLowerCase().includes(q) || 
        b.guestEmail.toLowerCase().includes(q)
      )
    };
    
    return HttpResponse.json(results);
  }),

  // CSV import endpoint
  http.post(`${baseUrl}/import/csv`, async ({ request }) => {
    const jobId = `JOB${Math.random().toString(36).substr(2, 9)}`;
    return HttpResponse.json({ jobId }, { status: 202 });
  }),

  http.get(`${baseUrl}/import/:jobId/status`, ({ params }) => {
    return HttpResponse.json({
      jobId: params.jobId,
      status: 'completed',
      processed: 10,
      total: 10,
      errors: []
    });
  }),

  // Seasonal pricing rules
  http.get(`${baseUrl}/pricing/rules`, () => {
    return HttpResponse.json(demoData.seasonalRules);
  }),

  http.post(`${baseUrl}/pricing/rules`, async ({ request }) => {
    const body = await request.json() as Record<string, any>;
    const newRule = {
      id: `SR${Math.random().toString(36).substr(2, 9)}`,
      ...body
    };
    return HttpResponse.json(newRule, { status: 201 });
  }),

  // Staff roster
  http.get(`${baseUrl}/staff`, () => {
    return HttpResponse.json(demoData.staff);
  }),

  http.post(`${baseUrl}/staff/:id/shifts`, async ({ params, request }) => {
    const body = await request.json() as Record<string, any>;
    return HttpResponse.json({
      staffId: params.id,
      shift: body
    }, { status: 201 });
  })
];
