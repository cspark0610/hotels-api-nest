import { Test, TestingModule } from '@nestjs/testing';
import { VisitOrdersService } from './visit-orders.service';

describe('VisitOrdersService', () => {
  let service: VisitOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitOrdersService],
    }).compile();

    service = module.get<VisitOrdersService>(VisitOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
