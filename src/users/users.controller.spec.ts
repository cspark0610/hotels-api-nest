import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as mongoose from 'mongoose';
import { mockUser, mockHotel } from '../constants/mock.contants';
import { HotelsService } from '../hotels/hotels.service';
import { ForbiddenException } from '@nestjs/common';

const mockAddedHotel = { ...mockHotel };
const mockRemovedHotel = { ...mockHotel };

const mockUsersService = {
  addFavorite: jest.fn().mockResolvedValueOnce({ added: mockAddedHotel }),
  removeFavorite: jest
    .fn()
    .mockResolvedValueOnce({ removed: mockRemovedHotel }),
  addPurchase: jest.fn().mockResolvedValueOnce({ purchased: mockHotel }),
};
const mockHotelsService = {
  findById: jest.fn().mockResolvedValueOnce(mockHotel),
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let hotelsService: HotelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useValue: mockUsersService },
        HotelsService,
        { provide: HotelsService, useValue: mockHotelsService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    hotelsService = module.get<HotelsService>(HotelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
    expect(hotelsService).toBeDefined();
  });

  describe('addHotelToFavorites', () => {
    it('return an object with prop added when adding a favorite hotel', async () => {
      const hotelId = new mongoose.Types.ObjectId().toString();
      const result = await controller.addHotelToFavorites(
        hotelId,
        mockUser as any,
      );
      expect(usersService.addFavorite).toHaveBeenCalled();
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
      expect(usersService.removeFavorite).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result.removed).toMatchObject(mockRemovedHotel);
    });
  });

  describe('addPurchaseHotelToUser', () => {
    it('should call addPurchase service', async () => {
      const anyMockUser = {
        ...mockUser,
        _id: new mongoose.Types.ObjectId().toString(),
      };
      const hotelId = new mongoose.Types.ObjectId().toString();
      const result = await controller.addPurchaseHotelToUser(
        hotelId,
        anyMockUser as any,
      );
      expect(hotelsService.findById).toHaveBeenCalled();
      expect(usersService.addPurchase).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result.purchased).toMatchObject(mockAddedHotel);
    });
    it('should throw forbidden error when purchasing its own hotel', async () => {
      const hotelId = new mongoose.Types.ObjectId().toString();

      await expect(
        controller.addPurchaseHotelToUser(hotelId, mockUser as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
