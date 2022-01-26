import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async getFavorites(currentUser: User): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: currentUser._id })
      .populate('favorites');
    return user;
  }
  async getPurchases(currentUser: User): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: currentUser._id })
      .populate('hotelPurchases');
    return user;
  }

  async addFavorite(hotelId: string, user: User): Promise<{ added: Hotel }> {
    const hotel = await this.hotelModel.findById(hotelId);

    // buscar el user sobre el cual se va a agregar el hotel como favorito
    const userFound = await this.userModel.findById(user._id);
    if (!userFound.favorites.map((i) => i.toString()).includes(hotelId)) {
      userFound.favorites.push(hotelId);
      await userFound.save();
      return { added: hotel };
    }
    // si el hotelID ya estaba en favoritos, se lanza un error porque no se debe pushear el mismo hotelID mas de una vez
    throw new ForbiddenException('Hotel ID already in favorites');
  }

  async removeFavorite(hotelId: string, user): Promise<{ removed: Hotel }> {
    const hotel = await this.hotelModel.findById(hotelId);

    // buscar el user sobre el cual se va a agregar el hotel como favorito
    const userFound = await this.userModel.findById(user._id);

    if (userFound.favorites.map((i) => i.toString()).includes(hotelId)) {
      // se filtra del array de favoritos si ese hotelId ya exisitia en favoritos

      const filtered = userFound.favorites
        .map((i) => i.toString())
        .filter((id) => id !== hotelId);

      // se actualiza el array de favoritos
      userFound.favorites = filtered;

      await userFound.save();
      return { removed: hotel };
    }
    // si el hotel no esta en favoritos, se lanza un error
    throw new ForbiddenException(
      'Hotel ID not in favorites so you can not remove it',
    );
  }

  async addPurchase(
    hotelId: string,
    currentUser: User,
  ): Promise<{ purchased: Hotel }> {
    const hotel = await this.hotelModel.findById(hotelId);
    const userFound = await this.userModel.findById(currentUser._id);

    if (!userFound.hotelPurchases.map((i) => i.toString()).includes(hotelId)) {
      userFound.hotelPurchases.push(hotelId);
      // actualizo el estado de isSold a true
      const updatedHotel = await this.hotelModel.findByIdAndUpdate(hotelId, {
        isSold: true,
      });
      await updatedHotel.save();
      await userFound.save();
      return { purchased: hotel };
    }
    // si el hotelID ya estaba en el array de purchases, se lanza un error porque no se puede comprar un mismo hotel mas de una vez
    throw new ForbiddenException('Hotel ID already in hotel purchases');
  }
}
