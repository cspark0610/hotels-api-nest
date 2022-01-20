import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { HotelsService } from './hotels.service';
import { Hotel } from './schemas/hotel.schema';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get()
  async getAllHotels(@Query() query: ExpressQuery): Promise<Hotel[]> {
    return this.hotelsService.findAll(query);
  }

  @Post()
  async createHotel(@Body() hotel: CreateHotelDto): Promise<Hotel> {
    return this.hotelsService.create(hotel);
  }

  @Get('/:id')
  async getHotelById(@Param('id') id: string): Promise<Hotel> {
    return this.hotelsService.findById(id);
  }

  @Put('/:id')
  async updateHotel(
    @Param('id') id: string,
    @Body() hotel: UpdateHotelDto,
  ): Promise<Hotel> {
    await this.hotelsService.findById(id);
    return this.hotelsService.updateById(id, hotel);
  }

  @Delete('/:id')
  async deleteHotel(@Param('id') id: string): Promise<{ deleted: boolean }> {
    await this.hotelsService.findById(id);
    const hotel = this.hotelsService.deleteById(id);
    return { deleted: !!hotel };
  }
}
