import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    // Validate dates
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    if (checkIn < new Date()) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    // Check room exists
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (!room.available) {
      throw new BadRequestException('Room is not available');
    }

    // Check for overlapping bookings
    const overlapping = await this.prisma.booking.count({
      where: {
        roomId: dto.roomId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    if (overlapping > 0) {
      throw new ConflictException('Room is not available for the selected dates');
    }

    // Retrieve confirmed/completed bookings for loyalty calculation
    const userBookings = await this.prisma.booking.findMany({
      where: {
        userId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      },
    });

    const points = userBookings.reduce(
      (sum, b) => sum + Math.floor(b.totalPrice / 100),
      0,
    );

    let discountPercent = 0.05; // Bronze
    if (points >= 5000) {
      discountPercent = 0.2; // Platinum
    } else if (points >= 1500) {
      discountPercent = 0.15; // Gold
    } else if (points >= 500) {
      discountPercent = 0.1; // Silver
    }

    // Calculate total price with loyalty discount
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const basePrice = nights * room.price;
    const totalPrice = Math.round(basePrice * (1 - discountPercent) * 100) / 100;

    return this.prisma.booking.create({
      data: {
        userId,
        roomId: dto.roomId,
        guestName: dto.guestName,
        guestEmail: dto.guestEmail,
        guestPhone: dto.guestPhone,
        checkIn,
        checkOut,
        guests: dto.guests,
        totalPrice,
        specialRequests: dto.specialRequests,
        status: BookingStatus.PENDING,
      },
      include: {
        room: {
          include: {
            hotel: { select: { id: true, name: true } },
            images: { take: 1 },
          },
        },
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where =
      role === 'ADMIN' || role === 'SUPER_ADMIN'
        ? {}
        : { userId };

    return this.prisma.booking.findMany({
      where,
      include: {
        room: {
          include: {
            hotel: { select: { id: true, name: true } },
            images: { take: 1 },
          },
        },
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            hotel: true,
            images: true,
          },
        },
        user: { select: { id: true, fullName: true, email: true } },
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Authorization check
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status as BookingStatus },
      include: {
        room: {
          include: {
            hotel: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async getAnalytics() {
    const [totalBookings, totalRevenue, recentBookings] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: BookingStatus.CONFIRMED },
      }),
      this.prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          room: { select: { name: true } },
          user: { select: { fullName: true } },
        },
      }),
    ]);

    return {
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
    };
  }
}
