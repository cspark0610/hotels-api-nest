import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import APIFeatures from '../utils/apiFeatures.util';
import { Hotel } from './schemas/hotel.schema';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name)
    private hotelModel: mongoose.Model<Hotel>,
  ) {}

  async findAll(query: Query): Promise<Hotel[]> {
    //options i search is case insensitive
    // localhost:3000/hotels?keyword=<variable>
    const resPerPageAsInt = parseInt(query.size as string);
    const currentPageAsInt = parseInt(query.page as string);

    const resPerPage = isNaN(resPerPageAsInt) ? 5 : resPerPageAsInt;
    const currentPage = isNaN(currentPageAsInt) ? 1 : currentPageAsInt;

    const skip = (currentPage - 1) * resPerPage;

    const keyword = query.keyword
      ? { name: { $regex: query.keyword, $options: 'i' } }
      : {};

    const hotels = await this.hotelModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return hotels;
  }

  async create(hotel: Hotel): Promise<Hotel> {
    const location = await APIFeatures.getHotelLocation(hotel.address);
    const createHotelData = Object.assign(hotel, { location });
    /**
     *   @Prop({ type: Object, ref: 'Location' })
     *    location?: Location;
     */

    const newHotel = await this.hotelModel.create(createHotelData);
    return newHotel;
  }

  async findById(id: string): Promise<any> {
    // mongoose valid ID validation
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid mongo ID');

    const hotel = await this.hotelModel.findById(id);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async updateById(id: string, hotel: Hotel): Promise<Hotel> {
    const updatedHotel = await this.hotelModel.findByIdAndUpdate(id, hotel, {
      new: true,
    });
    return updatedHotel;
  }

  async deleteById(id: string): Promise<Hotel> {
    const deletedHotel = await this.hotelModel.findByIdAndDelete(id);

    return deletedHotel;
  }
}
