import { IsEmail, IsEnum, IsOptional } from 'class-validator';
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
  readonly phone: number;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Category is not valid' })
  readonly category: Category;

  @IsOptional()
  readonly images?: object[];
}
