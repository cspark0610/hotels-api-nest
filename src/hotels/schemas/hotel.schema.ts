import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location } from './location.schema';
import { Document } from 'mongoose';
//import { IsEmpty } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import * as mongoose from 'mongoose';
//import { VisitOrder } from '../../visit-orders/schemas/visit-order.schema';

export enum Category {
  FIVE_START = 'FIVE_START',
  FOUR_START = 'FOUR_START',
  THREE_START = 'THREE_START',
  TWO_START = 'TWO_START',
  ONE_START = 'ONE_START',
}

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop({ type: Object, ref: 'Location' })
  location?: Location;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'VisitOrder' }])
  visitOrders?: string[];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
