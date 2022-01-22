import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Hotel } from '../../hotels/schemas/hotel.schema';

@Schema({ timestamps: true })
export class VisitOrder {
  @Prop()
  visitDate: Date;

  @Prop()
  aditionalInfo: string;

  @Prop()
  phoneContact: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  hotelId: Hotel;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const VisitOrderSchema = SchemaFactory.createForClass(VisitOrder);
