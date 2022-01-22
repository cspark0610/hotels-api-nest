import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { HotelSchema } from './schemas/hotel.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Hotel', schema: HotelSchema }]),
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [MongooseModule],
})
export class HotelsModule {}
