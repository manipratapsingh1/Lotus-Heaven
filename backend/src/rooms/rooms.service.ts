import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto, SearchRoomsDto } from './dto/room.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchRoomsDto) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.RoomWhereInput = {
      available: true,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.guests) {
      where.capacity = { gte: query.guests };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = query.minPrice;
      if (query.maxPrice) where.price.lte = query.maxPrice;
    }

    // Availability check: exclude rooms with overlapping bookings
    if (query.checkIn && query.checkOut) {
      where.bookings = {
        none: {
          AND: [
            { checkIn: { lt: new Date(query.checkOut) } },
            { checkOut: { gt: new Date(query.checkIn) } },
            { status: { in: ['CONFIRMED', 'PENDING'] } },
          ],
        },
      };
    }

    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        include: {
          hotel: { select: { id: true, name: true, city: true, country: true } },
          images: { select: { id: true, url: true } },
        },
        skip,
        take: limit,
        orderBy: { price: 'asc' },
      }),
      this.prisma.room.count({ where }),
    ]);

    return {
      data: rooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        hotel: true,
        images: true,
        reviews: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        hotelId: dto.hotelId,
        name: dto.name,
        type: dto.type,
        description: dto.description,
        price: dto.price,
        originalPrice: dto.originalPrice,
        capacity: dto.capacity,
        size: dto.size,
        amenities: dto.amenities || [],
        floor: dto.floor,
      },
      include: {
        hotel: { select: { id: true, name: true } },
        images: true,
      },
    });
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);

    return this.prisma.room.update({
      where: { id },
      data: dto,
      include: {
        hotel: { select: { id: true, name: true } },
        images: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.room.delete({ where: { id } });
    return { message: 'Room deleted successfully' };
  }

  async checkAvailability(id: string, checkIn: string, checkOut: string) {
    const overlapping = await this.prisma.booking.count({
      where: {
        roomId: id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { checkIn: { lt: new Date(checkOut) } },
          { checkOut: { gt: new Date(checkIn) } },
        ],
      },
    });

    return { available: overlapping === 0 };
  }
}
