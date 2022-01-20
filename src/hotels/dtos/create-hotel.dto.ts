import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
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
  readonly phone: number;

  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'please enter the correct category' })
  readonly category: Category;

  readonly images?: object[];
}
