import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { VisitOrder } from './schemas/visit-order.schema';
import { VisitOrdersService } from './visit-orders.service';
import { HotelsService } from '../hotels/hotels.service';
import { Hotel } from '../hotels/schemas/hotel.schema';
import { Model } from 'mongoose';
import {
  mockVisitOrder,
  mockHotel,
  mockUser,
  mockNotFoundException,
  mockForbiddenException,
} from '../constants/mock.contants';
import * as mongoose from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockHotelsService = {
  findById: jest.fn(),
  save: jest.fn(),
};
const mockVisitOrdersService = {
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('VisitOrdersService', () => {
  let visitOrdersService: VisitOrdersService;
  let hotelsService: HotelsService;
  let visitOrderModel: Model<VisitOrder>;
  let hotelModel: Model<Hotel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitOrdersService,
        {
          provide: getModelToken(VisitOrder.name),
          useValue: mockVisitOrdersService,
        },
        HotelsService,
        {
          provide: getModelToken(Hotel.name),
          useValue: mockHotelsService,
        },
      ],
    }).compile();

    visitOrdersService = module.get<VisitOrdersService>(VisitOrdersService);
    hotelsService = module.get<HotelsService>(HotelsService);

    visitOrderModel = module.get<Model<VisitOrder>>(
      getModelToken(VisitOrder.name),
    );
    hotelModel = module.get<Model<Hotel>>(getModelToken(Hotel.name));
  });

  it('hotelsService and visitOrdersService should be defined', () => {
    expect(hotelsService).toBeDefined();
    expect(visitOrdersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of visit orders', async () => {
      jest
        .spyOn(visitOrderModel, 'find')
        .mockImplementationOnce(() => Promise.resolve([mockVisitOrder]) as any);
      const result = await visitOrdersService.findAll();
      expect(result).toEqual([mockVisitOrder]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findByHotel', () => {
    it('should return an array of visit orders that belongs to one Hotel', async () => {
      const hotel = {
        ...mockHotel,
        _id: new mongoose.Types.ObjectId().toString(),
        visitOrders: [new mongoose.Types.ObjectId().toString()],
      };
      //console.log(hotel);
      jest
        .spyOn(visitOrderModel, 'find')
        .mockImplementationOnce(() => Promise.resolve(hotel) as any);
      const result = await visitOrdersService.findByHotel({
        hotel: hotel._id,
      } as any);
      //console.log('result', result);
      expect(result).toMatchObject(hotel);
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('create visitOrder', () => {
    const mockCreateDataObject = Object.assign(mockVisitOrder, {
      userId: new mongoose.Types.ObjectId().toString(),
    });
    const hotel = {
      ...mockHotel,
      _id: new mongoose.Types.ObjectId().toString(),
      visitOrders: [],
    };
    console.log('hotel', hotel);
    console.log('mockCreateDataObject', mockCreateDataObject);

    it('should throw not found exception if id hotel passed is wrong', async () => {
      jest
        .spyOn(hotelModel, 'findById')
        .mockRejectedValue(mockNotFoundException);
      await expect(
        visitOrdersService.create(mockCreateDataObject as any, mockUser as any),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw forbidden exception if user passed equals hotel.user', async () => {
      jest
        .spyOn(hotelModel, 'findById')
        .mockRejectedValue(mockForbiddenException);
      await expect(
        visitOrdersService.create(mockCreateDataObject as any, mockUser as any),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should create a new visit order', async () => {
      jest
        .spyOn(hotelModel, 'findById')
        .mockImplementationOnce(() => Promise.resolve(hotel) as any);
      jest
        .spyOn(visitOrderModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockVisitOrder) as any);
      const createdVisitOrder = await visitOrdersService.create(
        mockCreateDataObject as any,
        mockUser as any,
      );
      console.log('result', createdVisitOrder);
      hotel.visitOrders.push(createdVisitOrder);
      //expect(createdVisitOrder).toMatchObject(mockVisitOrder);
      expect(createdVisitOrder).toBeInstanceOf(Object);
    });
  });
  describe('update visit order by id', () => {
    const updateBody = { aditionalInfo: 'test new aditional info' };
    const visitOrder = {
      ...mockVisitOrder,
      aditionalInfo: 'test new aditional info',
    };

    it('should update a visit order', async () => {
      jest
        .spyOn(visitOrderModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(visitOrder as any);
      const updatedVisitOrder = await visitOrdersService.updateById(
        new mongoose.Types.ObjectId().toString(),
        updateBody as any,
      );
      expect(updatedVisitOrder).toBeInstanceOf(Object);
      expect(updatedVisitOrder.aditionalInfo).toEqual(updateBody.aditionalInfo);
    });
  });

  describe('delete a visit order', () => {
    const deleteResult = { deleted: true };
    const visitOrder = { ...mockVisitOrder, _id: '123456' };
    const hotel = {
      ...mockHotel,
      _id: new mongoose.Types.ObjectId().toString(),
      visitOrders: ['123456'],
    };
    it('should delete a visit order if id passed is valid', async () => {
      jest
        .spyOn(hotelModel, 'findById')
        .mockImplementationOnce(() => Promise.resolve(hotel) as any);
      jest
        .spyOn(visitOrderModel, 'findByIdAndDelete')
        .mockImplementationOnce(() => Promise.resolve(deleteResult) as any);
      const result = await visitOrdersService.deleteById(visitOrder._id);
      const filtered = hotel.visitOrders.filter(
        (item) => item !== visitOrder._id,
      );
      // falta mockear esta parte await hotel.save();
      mockHotelsService.save = jest.fn().mockImplementationOnce(
        () =>
          Promise.resolve({
            ...hotel,
            visitOrders: filtered,
          }) as any,
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.deleted).toBe(true);
      //expect(hotel.visitOrders.length).toBe(0);
    });
  });
});
