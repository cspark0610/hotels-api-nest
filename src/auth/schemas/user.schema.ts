import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export enum UserRoles {
  SELLER = 'SELLER',
  USER = 'USER',
}

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'duplicate email entered'] })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }])
  favorites?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
