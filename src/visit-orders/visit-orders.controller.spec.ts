import { Test, TestingModule } from '@nestjs/testing';
import { VisitOrdersController } from './visit-orders.controller';

describe('VisitOrdersController', () => {
  let controller: VisitOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitOrdersController],
    }).compile();

    controller = module.get<VisitOrdersController>(VisitOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
