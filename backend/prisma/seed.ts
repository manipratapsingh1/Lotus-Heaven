import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding realistic database...');

  // Create/clean existing database entries
  // (We use transaction or sequential deletes to prevent dependency issues)
  await prisma.auditLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.dynamicPricing.deleteMany({});
  await prisma.roomImage.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});

  // 1. Create Users
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const guestPassword = await bcrypt.hash('Guest@123456', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@bloomhaven.com',
      passwordHash: adminPassword,
      fullName: 'Admin User',
      role: Role.SUPER_ADMIN,
      verified: true,
    },
  });

  const guest1 = await prisma.user.create({
    data: {
      email: 'guest@example.com',
      passwordHash: guestPassword,
      fullName: 'Jane Traveler',
      role: Role.GUEST,
      verified: true,
    },
  });

  const guest2 = await prisma.user.create({
    data: {
      email: 'alice.smith@example.com',
      passwordHash: guestPassword,
      fullName: 'Alice Smith',
      role: Role.GUEST,
      verified: true,
    },
  });

  const guest3 = await prisma.user.create({
    data: {
      email: 'bob.johnson@example.com',
      passwordHash: guestPassword,
      fullName: 'Bob Johnson',
      role: Role.GUEST,
      verified: true,
    },
  });

  const guest4 = await prisma.user.create({
    data: {
      email: 'charlie.brown@example.com',
      passwordHash: guestPassword,
      fullName: 'Charlie Brown',
      role: Role.GUEST,
      verified: true,
    },
  });

  const guest5 = await prisma.user.create({
    data: {
      email: 'diana.prince@example.com',
      passwordHash: guestPassword,
      fullName: 'Diana Prince',
      role: Role.GUEST,
      verified: true,
    },
  });

  console.log('  ✅ Users created');

  // 2. Create Hotel
  const hotel = await prisma.hotel.create({
    data: {
      id: 'hotel-bloom-haven-1',
      name: 'Bloom Haven Grand',
      description:
        'A luxury boutique hotel nestled in the heart of the city, offering world-class amenities and breathtaking views.',
      address: '123 Luxury Avenue',
      city: 'San Francisco',
      country: 'United States',
      rating: 4.8,
    },
  });
  console.log(`  ✅ Hotel created: ${hotel.name}`);

  // 3. Create Rooms
  const roomsData = [
    {
      id: 'room-deluxe-king',
      name: 'Deluxe King Room',
      type: 'deluxe',
      description:
        'Spacious room with a king-size bed, modern amenities, and stunning city views. Perfect for couples seeking comfort and luxury.',
      price: 7499,
      originalPrice: 8999,
      capacity: 2,
      size: 35,
      amenities: ['WiFi', 'Smart TV', 'Minibar', 'Room Service', 'City View', 'Air Conditioning'],
      rating: 4.8,
      reviewCount: 5,
      floor: 12,
    },
    {
      id: 'room-presidential-suite',
      name: 'Presidential Suite',
      type: 'suite',
      description:
        'Our most luxurious accommodation featuring separate living areas, premium furnishings, and panoramic views.',
      price: 24999,
      originalPrice: null,
      capacity: 4,
      size: 85,
      amenities: [
        'WiFi', 'Smart TV', 'Minibar', 'Room Service', 'Panoramic View',
        'Jacuzzi', 'Private Balcony', 'Butler Service',
      ],
      rating: 5.0,
      reviewCount: 3,
      floor: 20,
    },
    {
      id: 'room-executive-double',
      name: 'Executive Double Room',
      type: 'executive',
      description:
        'Designed for business travelers with a comfortable workspace, high-speed internet, and modern amenities.',
      price: 4999,
      originalPrice: null,
      capacity: 2,
      size: 32,
      amenities: ['WiFi', 'Smart TV', 'Work Desk', 'Room Service', 'Coffee Maker', 'Air Conditioning'],
      rating: 4.6,
      reviewCount: 4,
      floor: 8,
    },
    {
      id: 'room-garden-view',
      name: 'Garden View Suite',
      type: 'suite',
      description:
        'A serene retreat overlooking lush gardens, featuring premium bedding and a private terrace for relaxation.',
      price: 12999,
      originalPrice: 14999,
      capacity: 3,
      size: 55,
      amenities: ['WiFi', 'Smart TV', 'Minibar', 'Garden View', 'Private Terrace', 'Rain Shower'],
      rating: 4.7,
      reviewCount: 3,
      floor: 3,
    },
    {
      id: 'room-standard-twin',
      name: 'Standard Twin Room',
      type: 'standard',
      description:
        'Comfortable and cozy, our standard twin room offers everything you need for a pleasant stay at an affordable price.',
      price: 2999,
      originalPrice: null,
      capacity: 2,
      size: 25,
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Daily Housekeeping'],
      rating: 4.3,
      reviewCount: 6,
      floor: 5,
    },
    {
      id: 'room-penthouse',
      name: 'The Penthouse',
      type: 'penthouse',
      description:
        'The crown jewel of Bloom Haven — a full-floor penthouse with 360° skyline views, private dining, and dedicated concierge.',
      price: 49999,
      originalPrice: 59999,
      capacity: 6,
      size: 150,
      amenities: [
        'WiFi', 'Smart TV', 'Private Kitchen', 'Butler Service', '360° Views',
        'Jacuzzi', 'Private Elevator', 'Concierge', 'Wine Cellar',
      ],
      rating: 5.0,
      reviewCount: 2,
      floor: 25,
    },
  ];

  for (const r of roomsData) {
    await prisma.room.create({
      data: {
        ...r,
        hotelId: hotel.id,
      },
    });
  }
  console.log('  ✅ Rooms created');

  // Room images
  const roomImages = [
    { roomId: 'room-deluxe-king', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800' },
    { roomId: 'room-presidential-suite', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
    { roomId: 'room-executive-double', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800' },
    { roomId: 'room-garden-view', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800' },
    { roomId: 'room-standard-twin', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' },
    { roomId: 'room-penthouse', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
  ];

  for (const img of roomImages) {
    await prisma.roomImage.create({
      data: {
        id: `img-${img.roomId}`,
        roomId: img.roomId,
        url: img.url,
      },
    });
  }
  console.log('  ✅ Room images seeded');

  // 4. Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME20',
      discountPercent: 20,
      active: true,
      expiresAt: new Date('2027-12-31'),
    },
  });
  console.log('  ✅ Coupon: WELCOME20 seeded');

  // 5. Create Realistic Bookings, Payments, and Reviews
  const guestsList = [guest1, guest2, guest3, guest4, guest5];
  const roomsList = await prisma.room.findMany();

  // Helper to generate dates relative to today
  const getRelativeDate = (offsetDays: number, hour = 14): Date => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  // Static list of booking details spread over the last 6 months (and future months)
  // Current date is 2026-06-18
  const bookingsData = [
    // --- JANUARY 2026 (Completed) ---
    { offsetIn: -160, offsetOut: -156, roomIdx: 4, guestIdx: 0, status: BookingStatus.COMPLETED, rating: 4, title: 'Pleasant standard stay', comment: 'Very clean and cozy room. Friendly staff!' },
    { offsetIn: -155, offsetOut: -152, roomIdx: 0, guestIdx: 1, status: BookingStatus.COMPLETED, rating: 5, title: 'Incredible Deluxe Room', comment: 'City views were amazing. Highly recommend the deluxe king bed!' },
    { offsetIn: -150, offsetOut: -148, roomIdx: 2, guestIdx: 2, status: BookingStatus.COMPLETED, rating: 4, title: 'Great for work trip', comment: 'The executive desk was very useful. Quick internet.' },
    { offsetIn: -145, offsetOut: -140, roomIdx: 1, guestIdx: 3, status: BookingStatus.COMPLETED, rating: 5, title: 'Unparalleled luxury', comment: 'The Presidential Suite exceeded all expectations. Incredible butler service.' },

    // --- FEBRUARY 2026 (Completed) ---
    { offsetIn: -130, offsetOut: -126, roomIdx: 3, guestIdx: 4, status: BookingStatus.COMPLETED, rating: 5, title: 'Beautiful garden view', comment: 'Waking up to the green garden view from the terrace was amazing.' },
    { offsetIn: -125, offsetOut: -122, roomIdx: 4, guestIdx: 0, status: BookingStatus.COMPLETED, rating: 4, title: 'Budget friendly and comfortable', comment: 'Great service at an affordable rate.' },
    { offsetIn: -120, offsetOut: -115, roomIdx: 0, guestIdx: 2, status: BookingStatus.COMPLETED, rating: 5, title: 'Loved the room service!', comment: 'Deluxe king room was perfect. Room service was fast and tasty.' },
    { offsetIn: -110, offsetOut: -108, roomIdx: 2, guestIdx: 3, status: BookingStatus.COMPLETED, rating: 3, title: 'Average executive stay', comment: 'Good room, but the AC was slightly noisy.' },

    // --- MARCH 2026 (Completed & Cancelled) ---
    { offsetIn: -100, offsetOut: -96, roomIdx: 1, guestIdx: 1, status: BookingStatus.COMPLETED, rating: 5, title: 'Splendid luxury experience', comment: 'Wonderful Jacuzzi and terrace. We had a great family time.' },
    { offsetIn: -95, offsetOut: -92, roomIdx: 0, guestIdx: 4, status: BookingStatus.COMPLETED, rating: 5, title: 'Perfect weekend gateway', comment: 'Deluxe room was top class. Clean bathroom, great layout.' },
    { offsetIn: -90, offsetOut: -88, roomIdx: 4, guestIdx: 2, status: BookingStatus.CANCELLED },
    { offsetIn: -85, offsetOut: -80, roomIdx: 5, guestIdx: 0, status: BookingStatus.COMPLETED, rating: 5, title: 'Mindblowing Penthouse', comment: 'The views were breathtaking. Premium service in every aspect.' },
    { offsetIn: -78, offsetOut: -75, roomIdx: 2, guestIdx: 1, status: BookingStatus.COMPLETED, rating: 4, title: 'Professional and modern', comment: 'Helpful work amenities. Great coffee maker.' },

    // --- APRIL 2026 (Completed) ---
    { offsetIn: -70, offsetOut: -66, roomIdx: 3, guestIdx: 3, status: BookingStatus.COMPLETED, rating: 5, title: 'Tranquil garden retreat', comment: 'Quiet, clean, and perfectly decorated.' },
    { offsetIn: -65, offsetOut: -62, roomIdx: 4, guestIdx: 4, status: BookingStatus.COMPLETED, rating: 4, title: 'Satisfactory stay', comment: 'Clean sheets, functional bathroom. Value for money.' },
    { offsetIn: -60, offsetOut: -56, roomIdx: 0, guestIdx: 0, status: BookingStatus.COMPLETED, rating: 5, title: 'Superb deluxe standard', comment: 'Comfortable bed and rich amenities.' },
    { offsetIn: -50, offsetOut: -46, roomIdx: 2, guestIdx: 1, status: BookingStatus.COMPLETED, rating: 5, title: 'Excellent business facilities', comment: 'Fast checkin, great desk setup.' },
    { offsetIn: -42, offsetOut: -39, roomIdx: 1, guestIdx: 2, status: BookingStatus.COMPLETED, rating: 5, title: 'Memorable anniversary in suite', comment: 'Felt like royalty. The butler was very professional.' },

    // --- MAY 2026 (Completed & Cancelled) ---
    { offsetIn: -35, offsetOut: -30, roomIdx: 5, guestIdx: 4, status: BookingStatus.COMPLETED, rating: 5, title: 'An unforgettable penthouse stay', comment: 'Private elevator, high class wine, and spectacular skyline views.' },
    { offsetIn: -28, offsetOut: -25, roomIdx: 0, guestIdx: 3, status: BookingStatus.COMPLETED, rating: 4, title: 'Very good stay', comment: 'Spacious room and good view.' },
    { offsetIn: -22, offsetOut: -20, roomIdx: 4, guestIdx: 1, status: BookingStatus.CANCELLED },
    { offsetIn: -18, offsetOut: -15, roomIdx: 2, guestIdx: 0, status: BookingStatus.COMPLETED, rating: 4, title: 'Clean and functional', comment: 'Friendly staff at the reception.' },
    { offsetIn: -12, offsetOut: -8, roomIdx: 3, guestIdx: 2, status: BookingStatus.COMPLETED, rating: 4, title: 'Lovely room', comment: 'We enjoyed our stay overlooking the gardens.' },

    // --- JUNE 2026 (Current Month - Mixed) ---
    { offsetIn: -7, offsetOut: -4, roomIdx: 0, guestIdx: 1, status: BookingStatus.COMPLETED, rating: 5, title: 'Exceptional stay', comment: 'Great deluxe room. Clean and luxury.' },
    { offsetIn: -2, offsetOut: 2, roomIdx: 4, guestIdx: 4, status: BookingStatus.CONFIRMED }, // Currently checked in!
    { offsetIn: 1, offsetOut: 4, roomIdx: 2, guestIdx: 3, status: BookingStatus.CONFIRMED },  // Starts tomorrow!
    { offsetIn: 3, offsetOut: 7, roomIdx: 0, guestIdx: 0, status: BookingStatus.PENDING },    // Pending approval
    { offsetIn: 8, offsetOut: 11, roomIdx: 3, guestIdx: 2, status: BookingStatus.CONFIRMED },

    // --- JULY 2026 (Future Bookings) ---
    { offsetIn: 15, offsetOut: 20, roomIdx: 1, guestIdx: 1, status: BookingStatus.CONFIRMED },
    { offsetIn: 22, offsetOut: 25, roomIdx: 0, guestIdx: 4, status: BookingStatus.PENDING },
    { offsetIn: 28, offsetOut: 32, roomIdx: 4, guestIdx: 3, status: BookingStatus.CONFIRMED },

    // --- AUGUST 2026 (Future Bookings) ---
    { offsetIn: 40, offsetOut: 45, roomIdx: 5, guestIdx: 0, status: BookingStatus.CONFIRMED },
    { offsetIn: 48, offsetOut: 52, roomIdx: 2, guestIdx: 2, status: BookingStatus.PENDING },
  ];

  let bookingCounter = 1;
  for (const bData of bookingsData) {
    const checkIn = getRelativeDate(bData.offsetIn, 14);
    const checkOut = getRelativeDate(bData.offsetOut, 11);
    const room = roomsList[bData.roomIdx];
    const guest = guestsList[bData.guestIdx];

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = room.price * nights;

    const booking = await prisma.booking.create({
      data: {
        id: `booking-real-${String(bookingCounter).padStart(3, '0')}`,
        userId: guest.id,
        roomId: room.id,
        guestName: guest.fullName || 'Guest Name',
        guestEmail: guest.email,
        guestPhone: `+1 555-010${bookingCounter}`,
        checkIn,
        checkOut,
        guests: Math.min(room.capacity, 2),
        totalPrice,
        status: bData.status,
        specialRequests: bData.status === BookingStatus.PENDING ? 'Requesting early check-in' : null,
        createdAt: getRelativeDate(bData.offsetIn - 15, 10), // Booked 15 days before checkin
      },
    });

    // Seed corresponding payment
    if (bData.status !== BookingStatus.PENDING) {
      const isCancelled = bData.status === BookingStatus.CANCELLED;
      await prisma.payment.create({
        data: {
          id: `pay-real-${String(bookingCounter).padStart(3, '0')}`,
          bookingId: booking.id,
          stripeSessionId: `session_real_${booking.id}`,
          amount: totalPrice,
          currency: 'inr',
          status: isCancelled ? 'refunded' : 'succeeded',
          createdAt: getRelativeDate(bData.offsetIn - 15, 10),
        },
      });
    }

    // Seed review for completed stay
    if (bData.status === BookingStatus.COMPLETED && bData.rating) {
      await prisma.review.create({
        data: {
          id: `rev-real-${String(bookingCounter).padStart(3, '0')}`,
          userId: guest.id,
          roomId: room.id,
          bookingId: booking.id,
          rating: bData.rating,
          title: bData.title || 'Nice stay',
          comment: bData.comment || 'Everything was good.',
          verifiedStay: true,
          createdAt: getRelativeDate(bData.offsetOut + 1, 12), // Reviewed 1 day after checkout
        },
      });
    }

    bookingCounter++;
  }
  console.log(`  ✅ ${bookingCounter - 1} Bookings, Payments, and Reviews created`);

  // 6. Seed Dynamic Pricing Rules
  const dynamicPricingData = [
    { roomId: 'room-deluxe-king', date: getRelativeDate(0), priceMultiplier: 1.15, reason: 'High weekend occupancy markup' },
    { roomId: 'room-presidential-suite', date: getRelativeDate(1), priceMultiplier: 1.25, reason: 'Conference event weekend' },
    { roomId: 'room-penthouse', date: getRelativeDate(15), priceMultiplier: 1.35, reason: 'Summer holiday peak rates' },
  ];

  for (const dp of dynamicPricingData) {
    await prisma.dynamicPricing.create({
      data: {
        roomId: dp.roomId,
        date: dp.date,
        priceMultiplier: dp.priceMultiplier,
        reason: dp.reason,
      },
    });
  }
  console.log('  ✅ Dynamic pricing adjustments seeded');

  // 7. Seed Messages
  // Let's seed conversations on the active checked-in booking (booking 24: room-standard-twin, guest5)
  const activeBooking = await prisma.booking.findFirst({
    where: { status: BookingStatus.CONFIRMED },
  });

  if (activeBooking) {
    const messages = [
      { senderId: activeBooking.userId, content: 'Hi there, is it possible to get extra towels in the room?' },
      { senderId: admin.id, content: 'Hello! Certainly. We will have housekeeping deliver extra towels to your suite shortly.' },
      { senderId: activeBooking.userId, content: 'Excellent, thank you for the prompt reply!' },
    ];

    for (const msg of messages) {
      await prisma.message.create({
        data: {
          bookingId: activeBooking.id,
          senderId: msg.senderId,
          content: msg.content,
          createdAt: new Date(),
        },
      });
    }
    console.log(`  ✅ Conversations seeded for booking ${activeBooking.id}`);
  }

  // 8. Seed Admin Audit Logs
  const auditLogs = [
    { userId: admin.id, action: 'ROOM_CREATE', details: 'Created Deluxe King Room (room-deluxe-king)' },
    { userId: admin.id, action: 'ROOM_UPDATE', details: 'Updated price for Presidential Suite to 24999' },
    { userId: admin.id, action: 'COUPON_CREATE', details: 'Created WELCOME20 coupon code with 20% discount' },
    { userId: admin.id, action: 'PRICING_MARKUP', details: 'Applied weekend markup on room-deluxe-king' },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: {
        userId: log.userId,
        action: log.action,
        details: log.details,
        ipAddress: '127.0.0.1',
      },
    });
  }
  console.log('  ✅ Audit logs seeded');

  console.log('🎉 Database populated with realistic historical data successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
