import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as mongoose from 'mongoose';
import { mockUser, mockHotel } from '../constants/mock.contants';

const mockAddedHotel = { ...mockHotel };
const mockRemovedHotel = { ...mockHotel };

const mockUsersService = {
  addFavorite: jest.fn().mockResolvedValueOnce({ added: mockAddedHotel }),
  removeFavorite: jest
    .fn()
    .mockResolvedValueOnce({ removed: mockRemovedHotel }),
};
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('addHotelToFavorites', () => {
    it('return an object with prop added when adding a favorite hotel', async () => {
      const hotelId = new mongoose.Types.ObjectId().toString();
      const result = await controller.addHotelToFavorites(
        hotelId,
        mockUser as any,
      );
      expect(service.addFavorite).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result.added).toMatchObject(mockAddedHotel);
    });
  });

  describe('removeHotelFromFavorites', () => {
    it('return an object with prop removed when removing a favorite hotel', async () => {
      const hotelId = new mongoose.Types.ObjectId().toString();
      const result = await controller.removeHotelFromFavorites(
        hotelId,
        mockUser as any,
      );
      expect(service.removeFavorite).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result.removed).toMatchObject(mockRemovedHotel);
    });
  });
});
