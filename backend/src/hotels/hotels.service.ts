import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.hotel.findMany({
      include: {
        rooms: {
          where: { available: true },
          select: { id: true, name: true, price: true, rating: true },
          take: 4,
        },
        _count: { select: { rooms: true } },
      },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            images: { take: 1 },
          },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async create(data: {
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
  }) {
    return this.prisma.hotel.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      address: string;
      city: string;
      country: string;
    }>,
  ) {
    await this.findOne(id);
    return this.prisma.hotel.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.hotel.delete({ where: { id } });
    return { message: 'Hotel deleted successfully' };
  }
}
