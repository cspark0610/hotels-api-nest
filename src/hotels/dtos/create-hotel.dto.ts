import {
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
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

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsBoolean({ message: 'please enter a boolean value' })
  isSold: boolean;

  @IsEmpty({ message: 'you can provide the user ID' })
  readonly user: User;
}
