import {
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/hotel.schema';

export class UpdateHotelDto {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  readonly email: string;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Category is not valid' })
  readonly category: Category;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isSold: boolean;

  @IsEmpty({ message: 'you can provide the user ID' })
  readonly user: User;
}
