import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { CreateVisitOrderDto } from './dtos/create-visit-order.dto';
import { UpdateVisitOrderDto } from './dtos/update-visit-order.dto';
import { VisitOrder } from './schemas/visit-order.schema';
import { VisitOrdersService } from './visit-orders.service';

@Controller('visit-orders')
export class VisitOrdersController {
  constructor(private visitOrdersService: VisitOrdersService) {}

  @Get()
  async getAllVisitOrders(): Promise<VisitOrder[]> {
    return this.visitOrdersService.findAll();
  }

  @Get('hotel/:hotelId')
  async getVisitOrdersByHotel(
    @Param('hotelId') hotelId: string,
  ): Promise<VisitOrder[]> {
    return this.visitOrdersService.findByHotel(hotelId);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createVisitOrder(
    @Body() createVisitOrderDto: CreateVisitOrderDto,
    @CurrentUser() user: User,
  ): Promise<VisitOrder> {
    return this.visitOrdersService.create(createVisitOrderDto as any, user);
  }

  @Put('/:visitOrderId')
  @UseGuards(AuthGuard())
  async updateVisitOrder(
    @Body() updateVisitOrderDto: UpdateVisitOrderDto,
    @Param('visitOrderId') visitOrderId: string,
    @CurrentUser() user: User,
  ): Promise<VisitOrder> {
    const visitOrder = await this.visitOrdersService.findById(visitOrderId);
    if (visitOrder.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You did not create this order visit so you cannot update it',
      );
    }
    return this.visitOrdersService.updateById(
      visitOrderId,
      updateVisitOrderDto,
    );
  }

  @Delete('/:visitOrderId')
  @UseGuards(AuthGuard())
  async deleteVisitOrder(
    @Param('visitOrderId') visitOrderId: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const visitOrder = await this.visitOrdersService.findById(visitOrderId);
    if (visitOrder.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You did not create this order visit so you cannot delete it',
      );
    }
    return this.visitOrdersService.deleteById(visitOrderId);
  }
}
