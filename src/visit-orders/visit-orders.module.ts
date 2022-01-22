import { Module } from '@nestjs/common';
import { VisitOrdersController } from './visit-orders.controller';
import { VisitOrdersService } from './visit-orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitOrderSchema } from './schemas/visit-order.schema';
import { AuthModule } from '../auth/auth.module';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [
    AuthModule,
    HotelsModule,
    MongooseModule.forFeature([
      { name: 'VisitOrder', schema: VisitOrderSchema },
    ]),
  ],
  controllers: [VisitOrdersController],
  providers: [VisitOrdersService],
})
export class VisitOrdersModule {}
