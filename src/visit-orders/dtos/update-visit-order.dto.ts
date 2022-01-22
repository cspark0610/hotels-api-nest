import { IsDate, IsEmpty, IsNumber, IsOptional } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class UpdateVisitOrderDto {
  @IsOptional()
  @IsDate()
  readonly visitDate?: Date;

  @IsOptional()
  readonly aditionalInfo?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Phone number must be a number' })
  readonly phoneContact?: number;

  @IsOptional()
  readonly hotelId?: string;

  @IsEmpty({ message: 'you can not provide the user ID' })
  readonly userId: User;
}
