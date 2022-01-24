import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel } from '../hotels/schemas/hotel.schema';
import * as mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Hotel.name)
    private hotelModel: mongoose.Model<Hotel>,

    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async addFavorite(hotelId: string, user: User): Promise<{ added: Hotel }> {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found by ID');
    }
    if (!user.favorites.includes(hotelId)) {
      user.favorites.push(hotelId);
      await user.save();
      return { added: hotel };
    }
    // si el hotelID ya estaba en favoritos, se lanza un error porque no se debe pushear el mismo hotelID mas de una vez
    throw new ForbiddenException('Hotel ID already in favorites');
  }

  async removeFavorite(hotelId: string, user): Promise<{ removed: Hotel }> {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found by ID');
    }
    if (user.favorites.includes(hotelId)) {
      // se filtra del array de favoritos si ese hotelId ya exisitia en favoritos
      user.favorites.filter((id) => id !== hotelId);
      await user.save();
      return { removed: hotel };
    }
    // si el hotel no esta en favoritos, se lanza un error
    throw new ForbiddenException(
      'Hotel ID not in favorites so you can not remove it',
    );
  }
}
