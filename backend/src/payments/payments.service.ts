import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigService } from '../config/config.service';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any = null;

  constructor(
    private prisma: PrismaService,
    private config: AppConfigService,
  ) {
    const keyId = this.config.razorpayKeyId;
    const keySecret = this.config.razorpayKeySecret;

    if (
      keyId &&
      keySecret &&
      keyId.startsWith('rzp_') &&
      !keySecret.includes('YOUR_')
    ) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  /**
   * Create a Razorpay order for a booking.
   * Returns orderId, amount, currency, and the key_id for the frontend.
   */
  async createOrder(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { hotel: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    // If Razorpay is not configured, confirm booking directly
    if (!this.razorpay) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
      return {
        message: 'Booking confirmed (payment gateway not configured)',
        bookingId,
      };
    }

    // Amount in paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(booking.totalPrice * 100);

    const order = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        bookingId,
        userId,
        roomName: booking.room.name,
        hotelName: booking.room.hotel.name,
      },
    });

    // Store the payment record
    await this.prisma.payment.create({
      data: {
        bookingId,
        stripeSessionId: order.id, // Reusing field for Razorpay order ID
        amount: booking.totalPrice,
        currency: 'INR',
        status: 'created',
      },
    });

    return {
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: this.config.razorpayKeyId,
      bookingId,
      prefill: {
        name: booking.guestName,
        email: booking.guestEmail,
        contact: booking.guestPhone,
      },
    };
  }

  /**
   * Verify Razorpay payment signature and confirm booking.
   */
  async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', this.config.razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Update payment record
    const payment = await this.prisma.payment.findFirst({
      where: { stripeSessionId: razorpay_order_id },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'completed' },
    });

    // Confirm the booking
    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
    });

    return { message: 'Payment verified and booking confirmed', bookingId: payment.bookingId };
  }

  async getPaymentHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        booking: { userId },
      },
      include: {
        booking: {
          select: {
            id: true,
            guestName: true,
            checkIn: true,
            checkOut: true,
            room: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refund(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status !== 'completed') {
      throw new BadRequestException('Payment cannot be refunded');
    }

    if (this.razorpay) {
      try {
        // Fetch the payment from Razorpay using the order
        const order = await this.razorpay.orders.fetch(payment.stripeSessionId);
        const payments = await this.razorpay.orders.fetchPayments(order.id);

        if (payments?.items?.length > 0) {
          const paymentItem = payments.items.find(
            (p: any) => p.status === 'captured',
          );
          if (paymentItem) {
            await this.razorpay.payments.refund(paymentItem.id, {
              speed: 'normal',
            });
          }
        }
      } catch (err) {
        // Log but don't block — mark as refunded locally
        console.error('Razorpay refund error:', err);
      }
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'refunded' },
    });

    await this.prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Refund processed successfully' };
  }
}
