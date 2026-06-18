import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Check if user has a completed booking for this room
    let verifiedStay = false;
    if (dto.bookingId) {
      const booking = await this.prisma.booking.findFirst({
        where: {
          id: dto.bookingId,
          userId,
          roomId: dto.roomId,
          status: 'COMPLETED',
        },
      });
      verifiedStay = !!booking;
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        roomId: dto.roomId,
        bookingId: dto.bookingId,
        title: dto.title,
        rating: dto.rating,
        comment: dto.comment,
        verifiedStay,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    // Update room average rating
    await this.updateRoomRating(dto.roomId);

    return review;
  }

  async findByRoom(roomId: string) {
    return this.prisma.review.findMany({
      where: { roomId },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        room: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && review.userId !== userId) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({ where: { id } });
    await this.updateRoomRating(review.roomId);

    return { message: 'Review deleted successfully' };
  }

  private async updateRoomRating(roomId: string) {
    const aggregation = await this.prisma.review.aggregate({
      where: { roomId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.room.update({
      where: { id: roomId },
      data: {
        rating: aggregation._avg.rating || 0,
        reviewCount: aggregation._count,
      },
    });
  }
}
