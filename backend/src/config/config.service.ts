import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get jwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  get jwtAccessExpiration(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m');
  }

  get jwtRefreshExpiration(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get razorpayKeyId(): string {
    return this.configService.get<string>('RAZORPAY_KEY_ID');
  }

  get razorpayKeySecret(): string {
    return this.configService.get<string>('RAZORPAY_KEY_SECRET');
  }

  get cloudinaryCloudName(): string {
    return this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
  }

  get cloudinaryApiKey(): string {
    return this.configService.get<string>('CLOUDINARY_API_KEY');
  }

  get cloudinaryApiSecret(): string {
    return this.configService.get<string>('CLOUDINARY_API_SECRET');
  }

  get resendApiKey(): string {
    return this.configService.get<string>('RESEND_API_KEY');
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
