import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import APIFeatures from '../utils/apiFeatures.util';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  readonly salt = 10;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;

    const hashPassword = await bcrypt.hash(password, this.salt);
    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        role,
      });

      const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);
      // una vez creado el token mandamos el mail
      //await this.mailService.sendUserConfirmation(user, token);
      return { token: token };
    } catch (error) {
      console.log(error);
      if (error.code === 11000)
        throw new ConflictException('Email already exists');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    // como habia excluido en el schema user @Prop({ select: false })
    //el password aca en la query debo hacer el .select()

    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedException('email not found');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    // en el login se le asigna un token al UserSchema, y devolverlo como response
    const token = await APIFeatures.assignJwtToken(user._id, this.jwtService);

    return { token: token };
  }
}
