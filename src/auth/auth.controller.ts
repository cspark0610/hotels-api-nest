import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    const token = await this.authService.signUp(signUpDto);
    return token;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);
    return token;
  }

  @Get('me')
  @UseGuards(AuthGuard())
  async getProfile(@CurrentUser() currentUser): Promise<any> {
    return currentUser;
  }

  // @Post('logout')
  // @UseGuards(AuthGuard())
  // async logout(@Session() session): Promise<void> {
  //   console.log('logout', session);
  //   //session.userToken = null;
  // }
}
