import { Test, TestingModule } from '@nestjs/testing';
import { VisitOrdersController } from './visit-orders.controller';
import { mockVisitOrder, mockUser } from '../constants/mock.contants';
import { PassportModule } from '@nestjs/passport';
import { VisitOrdersService } from './visit-orders.service';

const visitOrderByHotel = {
  ...mockVisitOrder,
  hotelId: '123456789',
};
const mockVisitOrdersService = {
  findById: jest.fn().mockResolvedValueOnce(mockVisitOrder),
  findAll: jest.fn().mockResolvedValueOnce([mockVisitOrder]),
  findByHotel: jest.fn().mockResolvedValueOnce([visitOrderByHotel]),
  create: jest.fn().mockResolvedValueOnce(mockVisitOrder),
  updateById: jest.fn(),
  deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
};

describe('VisitOrdersController', () => {
  let controller: VisitOrdersController;
  let service: VisitOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [VisitOrdersController],
      providers: [
        VisitOrdersService,
        { provide: VisitOrdersService, useValue: mockVisitOrdersService },
      ],
    }).compile();

    controller = module.get<VisitOrdersController>(VisitOrdersController);
    service = module.get<VisitOrdersService>(VisitOrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllVisitOrders', () => {
    it('should return an array of visit orders', async () => {
      const visitOrders = await controller.getAllVisitOrders();
      expect(service.findAll).toHaveBeenCalled();
      expect(visitOrders).toBeInstanceOf(Array);
      expect(visitOrders).toEqual([mockVisitOrder]);
    });
  });

  describe('getVisitOrdersByHotel', () => {
    it('should return an array of visit orders by hotel', async () => {
      const visitOrders = await controller.getVisitOrdersByHotel('123456789');
      expect(service.findByHotel).toHaveBeenCalled();
      expect(visitOrders).toBeInstanceOf(Array);
      expect(visitOrders).toEqual([visitOrderByHotel]);
    });
  });

  describe('createVisitOrder', () => {
    it('should create a new visit order', async () => {
      const createdVisitOrder = await controller.createVisitOrder(
        mockVisitOrder as any,
        mockUser as any,
      );
      expect(service.create).toHaveBeenCalled();
      expect(createdVisitOrder).toMatchObject(mockVisitOrder);
    });
  });

  describe('updateVisitOrder', () => {
    const updateBody = { aditionalInfo: 'test new aditional info' };
    const visitOrder = {
      ...mockVisitOrder,
      userId: '123456',
      aditionalInfo: 'test new aditional info',
    };
    const user = { ...mockUser, _id: '123456' };
    it('should update a visit order by passing a valid ID', async () => {
      mockVisitOrdersService.findById = jest
        .fn()
        .mockResolvedValueOnce(visitOrder);
      mockVisitOrdersService.updateById = jest
        .fn()
        .mockResolvedValueOnce(visitOrder);
      const updatedVisitOrder = await controller.updateVisitOrder(
        visitOrder.userId as any,
        updateBody as any,
        user as any,
      );
      expect(service.updateById).toHaveBeenCalled();
      expect(updatedVisitOrder).toMatchObject(visitOrder);
      expect(updatedVisitOrder.aditionalInfo).toEqual(updateBody.aditionalInfo);
    });
  });

  describe('deleteVisitOrder', () => {
    const visitOrder = { ...mockVisitOrder, userId: '123456' };
    const user = { ...mockUser, _id: '123456' };

    it('should delete a visit order by passing a valid ID', async () => {
      mockVisitOrdersService.findById = jest
        .fn()
        .mockResolvedValueOnce(visitOrder);

      const deletedVisitOrder = await controller.deleteVisitOrder(
        visitOrder._id as any,
        user as any,
      );
      expect(service.deleteById).toHaveBeenCalled();
      expect(deletedVisitOrder).toMatchObject({ deleted: true });
    });
  });
});
