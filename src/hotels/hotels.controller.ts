import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { HotelsService } from './hotels.service';
import { Hotel } from './schemas/hotel.schema';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get()
  async getAllHotels(@Query() query: ExpressQuery): Promise<Hotel[]> {
    return this.hotelsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('SELLER')
  async createHotel(
    @Body() hotel: CreateHotelDto,
    @CurrentUser() user: User,
  ): Promise<Hotel> {
    return this.hotelsService.create(hotel as any, user);
  }

  @Get('/:id')
  async getHotelById(@Param('id') id: string): Promise<Hotel> {
    return this.hotelsService.findById(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  async updateHotel(
    @Param('id') id: string,
    @Body() updateHotelBody: UpdateHotelDto,
    @CurrentUser() user: User,
  ): Promise<Hotel> {
    const response = await this.hotelsService.findById(id);

    if (response.user.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to update this hotel becuase you are not the owner',
      );
    }
    return this.hotelsService.updateById(id, updateHotelBody);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteHotel(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const resHotel = await this.hotelsService.findById(id);

    if (resHotel.user.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to delete this hotel because you are not the owner',
      );
    }

    const isImagesDeleted = await this.hotelsService.deleteImages(
      resHotel.images,
    );
    if (isImagesDeleted) {
      this.hotelsService.deleteById(id);
      return { deleted: true };
    }
    return { deleted: false };
  }

  //edit hotel images array
  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Hotel> {
    // console.log('files', files);
    // console.log('id', id);
    await this.hotelsService.findById(id);

    const response = await this.hotelsService.uploadImages(id, files);
    return response;
  }
}
