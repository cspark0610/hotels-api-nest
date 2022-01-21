import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { mockUser } from '../../constants/mock.contants';
import { User } from '../schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

const mockUserService = {
  findById: jest.fn(),
};
describe('jwt Strategy', () => {
  let jwtStrategy: JwtStrategy;
  let model: Model<User>;
  beforeEach(async () => {
    process.env.JWT_SECRET = 'secret-key';
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtStrategy,
        { provide: getModelToken(User.name), useValue: mockUserService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });
  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when user is valid', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any);

      const result = await jwtStrategy.validate({ id: mockUser._id });
      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw unauthorized exception if found user does not exists', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
      await expect(jwtStrategy.validate({ id: mockUser._id })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
