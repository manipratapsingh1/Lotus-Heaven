import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  guestName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  guestEmail: string;

  @ApiProperty({ example: '+1 234 567 8900' })
  @IsString()
  guestPhone: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-07-18' })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  guests: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ example: 'CONFIRMED', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] })
  @IsString()
  status: string;
}
