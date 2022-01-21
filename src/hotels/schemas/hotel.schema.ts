import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location } from './location.schema';
import { Document } from 'mongoose';
import { IsEmpty } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

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

  @IsEmpty({ message: 'you can provide the user ID' })
  readonly user: User;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
