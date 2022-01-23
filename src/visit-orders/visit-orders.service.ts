import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VisitOrder } from './schemas/visit-order.schema';
import * as mongoose from 'mongoose';
import { Hotel } from '../hotels/schemas/hotel.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateVisitOrderDto } from './dtos/create-visit-order.dto';

@Injectable()
export class VisitOrdersService {
  constructor(
    @InjectModel(VisitOrder.name)
    private visitOrderModel: mongoose.Model<VisitOrder>,

    @InjectModel(Hotel.name)
    private hotelModel: mongoose.Model<Hotel>,
  ) {}

  // get visit order by id => /visit-orders/:visitOrderId
  // para ser usado en el controller del PUT
  async findById(visitOrderId): Promise<VisitOrder> {
    const isValidId = mongoose.isValidObjectId(visitOrderId);
    if (!isValidId) {
      throw new BadRequestException(
        'Visit order not found becuase of invalid ID mongoose',
      );
    }
    const visitOrder = await this.visitOrderModel.findById(visitOrderId);
    return visitOrder;
  }

  // GET all visit orders from all hotels => /visit-orders
  async findAll(): Promise<VisitOrder[]> {
    const visitOrders = await this.visitOrderModel.find();
    return visitOrders;
  }
  // GET all visit orders from one hotels by id => /visit-orders/:hotelId
  async findByHotel(hotelId: string): Promise<VisitOrder[]> {
    const visitOrders = await this.visitOrderModel.find({ hotel: hotelId });
    return visitOrders;
  }

  async create(
    createVisitOrderDto: CreateVisitOrderDto,
    user: User,
  ): Promise<VisitOrder> {
    const createDataObject = Object.assign(createVisitOrderDto, {
      userId: user._id,
    });

    const hotel = await this.hotelModel.findById(createVisitOrderDto.hotelId);
    if (!hotel) {
      throw new NotFoundException('Hotel not found by ID');
    }
    // el owner del hotel no pude crear un order de visita de su propio hotel, en ese caso se lanza un fordibben exception
    if (hotel.user.toString() == user._id.toString()) {
      throw new ForbiddenException(
        'You are not allowed to create a visit order for this hotel because you are the owner of this hotel',
      );
    }

    const newVisitOrder = await this.visitOrderModel.create(createDataObject);
    // saving also visit order ID in hotel schema collection
    hotel.visitOrders.push(newVisitOrder._id.toString());
    await hotel.save();

    return newVisitOrder;
  }

  // update visit order by id => /visit-orders/:visitOrderId
  async updateById(visitOrderId, updateVisitOrderDto): Promise<VisitOrder> {
    return await this.visitOrderModel.findByIdAndUpdate(
      visitOrderId,
      updateVisitOrderDto,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  //delete visit order by id => /visit-orders/:visitOrderId
  async deleteById(visitOrderId: string): Promise<{ deleted: boolean }> {
    const deletedVisitOrder = await this.visitOrderModel.findByIdAndDelete(
      visitOrderId,
    );
    const hotel = await this.hotelModel.findById(deletedVisitOrder.hotelId);
    hotel.visitOrders.filter(
      (visitOrder) => visitOrder.toString() != visitOrderId,
    );
    await hotel.save();

    if (deletedVisitOrder) {
      return { deleted: true };
    }
    return { deleted: false };
  }
}
