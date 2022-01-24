import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { mockUser, mockToken } from '../constants/mock.contants';
import APIFeatures from '../utils/apiFeatures.util';
import { ConflictException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

const mockAuthService = {
  create: jest.fn(),
};
//set a mock mail service
const mockMailService = {};
describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret-key',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockAuthService },
        MailService,
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'user1@mail.com',
      name: 'namefake',
      password: '12345678',
      role: 'SELLER',
    };
    const loginDto = { email: signUpDto.email, password: signUpDto.password };
    it('should resgister a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('test-hashed-password');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      jest
        .spyOn(APIFeatures, 'assignJwtToken')
        .mockResolvedValueOnce(mockToken); // jwtToken
      const result = await service.signUp(signUpDto as any);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result.token).toEqual(mockToken);
    });
    it('should throw an error code 11000 when logging if email already exists', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      await expect(service.login(loginDto)).rejects.toThrow(ConflictException);
    });
  });
});
