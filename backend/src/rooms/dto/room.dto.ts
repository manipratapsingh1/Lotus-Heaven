import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 'Deluxe King Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'deluxe' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'A spacious deluxe room with city views.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 299 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 349, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  originalPrice?: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  capacity: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  size: number;

  @ApiProperty({ example: ['WiFi', 'Smart TV', 'Minibar'], required: false })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  floor?: number;
}

export class UpdateRoomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  originalPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  capacity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  floor?: number;
}

export class SearchRoomsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  guests?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  checkIn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  checkOut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
