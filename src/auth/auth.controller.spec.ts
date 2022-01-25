import { Test, TestingModule } from '@nestjs/testing';
import { mockToken } from '../constants/mock.contants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  signUp: jest.fn().mockResolvedValueOnce({ token: mockToken }),
  login: jest.fn().mockResolvedValueOnce({ token: mockToken }),
};
const signUpDto = {
  email: 'user1@mail.com',
  name: 'namefake',
  password: '12345678',
  role: 'SELLER',
};
const loginDto = { email: signUpDto.email, password: signUpDto.password };

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/signUp', () => {
    it('should return an object with token when register a new user', async () => {
      const result = await controller.signUp(signUpDto);
      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual({ token: mockToken });
    });
  });
  describe('/login', () => {
    it('should return an object with token when logging', async () => {
      const result = await controller.login(loginDto);
      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual({ token: mockToken });
    });
  });
});
