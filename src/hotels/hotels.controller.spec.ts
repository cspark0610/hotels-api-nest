import { Test, TestingModule } from '@nestjs/testing';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PassportModule } from '@nestjs/passport';
import { mockHotel, mockUser, newHotel } from '../constants/mock.contants';
import * as mongoose from 'mongoose';
import { ForbiddenException } from '@nestjs/common';

const mockHotelsService = {
  findAll: jest.fn().mockResolvedValueOnce([mockHotel]),
  create: jest.fn().mockResolvedValueOnce(newHotel),
  findById: jest.fn().mockResolvedValueOnce(mockHotel),
  updateById: jest.fn(),
  deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
};

describe('HotelsController', () => {
  let controller: HotelsController;
  let service: HotelsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [HotelsController],
      providers: [
        {
          provide: HotelsService,
          useValue: mockHotelsService,
        },
      ],
    }).compile();

    controller = module.get<HotelsController>(HotelsController);
    service = module.get<HotelsService>(HotelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllHotels', () => {
    it('should return an array of hotels', async () => {
      const hotels = await controller.getAllHotels({ keyword: '1' });
      expect(service.findAll).toHaveBeenCalled();
      expect(hotels).toBeInstanceOf(Array);
      expect(hotels).toEqual([mockHotel]);
    });
  });

  describe('createHotel', () => {
    it('should create a new hotel', async () => {
      const createResult = await controller.createHotel(
        newHotel as any,
        mockUser as any,
      );
      expect(service.create).toHaveBeenCalled();
      expect(createResult).toBeInstanceOf(Object);
      expect(createResult).toEqual(newHotel);
    });
  });

  describe('getHotelById', () => {
    it('should get an hotel by id', async () => {
      const result = await controller.getHotelById(mockHotel._id);
      expect(service.findById).toHaveBeenCalled();
      expect(result).toEqual(mockHotel);
    });
  });

  describe('updateHotelById', () => {
    const updateBody = { name: 'updated name' };
    const hotel = { ...mockHotel, name: 'updated name' };
    it('should update an hotel by valid mongoose id', async () => {
      mockHotelsService.findById = jest.fn().mockResolvedValueOnce(mockHotel);

      mockHotelsService.updateById = jest.fn().mockResolvedValueOnce(hotel);

      const result = await controller.updateHotel(
        hotel._id,
        updateBody as any,
        mockUser as any,
      );
      expect(service.updateById).toHaveBeenCalled();
      expect(result).toEqual(hotel);
      expect(result.name).toEqual(hotel.name);
    });

    it('should throw forbidden error when given a wrong id', async () => {
      mockHotelsService.findById = jest.fn().mockResolvedValueOnce(mockHotel);
      const user = { ...mockUser, _id: new mongoose.Types.ObjectId() };

      await expect(
        controller.updateHotel(hotel._id, updateBody as any, user as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
  describe('deleteHotel', () => {
    it('should delete an hotel by valid mongoose id', async () => {
      mockHotelsService.findById = jest.fn().mockResolvedValueOnce(mockHotel);
      const result = await controller.deleteHotel(
        mockHotel._id,
        mockUser as any,
      );
      expect(service.deleteById).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
