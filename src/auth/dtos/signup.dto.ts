import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRoles } from '../schemas/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: UserRoles;
}
