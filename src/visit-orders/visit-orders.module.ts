import { Module } from '@nestjs/common';
import { VisitOrdersController } from './visit-orders.controller';
import { VisitOrdersService } from './visit-orders.service';

@Module({
  controllers: [VisitOrdersController],
  providers: [VisitOrdersService]
})
export class VisitOrdersModule {}
