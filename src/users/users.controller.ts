import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from '../auth/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('favorites')
  @UseGuards(AuthGuard())
  async getHotelFavorites(@CurrentUser() currentUser: User) {
    return this.usersService.getFavorites(currentUser);
  }

  @Post('add-favorite/:hotelId')
  @UseGuards(AuthGuard())
  async addHotelToFavorites(
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.addFavorite(hotelId, user);
  }

  @Delete('delete-favorite/:hotelId')
  @UseGuards(AuthGuard())
  async removeHotelFromFavorites(
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.removeFavorite(hotelId, user);
  }
}
