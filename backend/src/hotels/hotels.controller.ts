import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all hotels' })
  findAll() {
    return this.hotelsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get hotel details' })
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new hotel (Admin only)' })
  create(@Body() data: { name: string; description: string; address: string; city: string; country: string }) {
    return this.hotelsService.create(data);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a hotel (Admin only)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.hotelsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a hotel (Admin only)' })
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
