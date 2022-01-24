import { IsEmail, IsEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/hotel.schema';

export class CreateHotelDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is not valid' })
  readonly email: string;

  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'please enter the correct category' })
  readonly category: Category;

  @IsEmpty({ message: 'you can provide the user ID' })
  readonly user: User;
}
