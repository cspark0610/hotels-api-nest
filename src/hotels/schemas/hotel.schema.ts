import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location } from './location.schema';
import { Document } from 'mongoose';

export enum Category {
  FIVE_START = 'FIVE_START',
  FOUR_START = 'FOUR_START',
  THREE_START = 'THREE_START',
  TWO_START = 'TWO_START',
  ONE_START = 'ONE_START',
}

@Schema()
export class Hotel extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[];

  @Prop({ type: Object, ref: 'Location' })
  location?: Location;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
