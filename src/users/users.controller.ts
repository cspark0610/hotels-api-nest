import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from '../auth/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { HotelsService } from '../hotels/hotels.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private hotelsService: HotelsService,
  ) {}

  @Get('favorites')
  @UseGuards(AuthGuard())
  async getHotelFavorites(@CurrentUser() currentUser: User) {
    return this.usersService.getFavorites(currentUser);
  }

  @Post('add-favorite/:hotelId')
  @UseGuards(AuthGuard())
  async addHotelToFavorites(
    @Param('hotelId') hotelId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.addFavorite(hotelId, currentUser);
  }

  @Delete('delete-favorite/:hotelId')
  @UseGuards(AuthGuard())
  async removeHotelFromFavorites(
    @Param('hotelId') hotelId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.removeFavorite(hotelId, currentUser);
  }

  @Post('purchase-hotel/:hotelId')
  @UseGuards(AuthGuard())
  async addPurchaseHotelToUser(
    @Param('hotelId') hotelId: string,
    @CurrentUser() currentUser: User,
  ) {
    const foundHotel = await this.hotelsService.findById(hotelId);
    if (foundHotel.user.toString() === currentUser._id.toString()) {
      throw new ForbiddenException('You can not purchase your own hotel');
    }
    return this.usersService.addPurchase(hotelId, currentUser);
  }

  @Get('purchases')
  @UseGuards(AuthGuard())
  async getHotelPurchases(@CurrentUser() currentUser: User) {
    return this.usersService.getPurchases(currentUser);
  }
}
