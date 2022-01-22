import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateVisitOrderDto {
  @IsNotEmpty()
  @IsDate()
  readonly visitDate: Date;

  @IsOptional()
  readonly aditionalInfo?: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Phone number must be a number' })
  readonly phoneContact: number;

  @IsNotEmpty()
  readonly hotelId: string;

  @IsEmpty({ message: 'you can not provide the user ID' })
  readonly userId: User;
}
