import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './role.schema';


@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password?: string; // Chỉ cần khi đăng ký qua form

  @Prop({ unique: true, sparse: true })
  uid?: string; // UID từ Firebase

  @Prop({ type: Types.ObjectId, ref: Role.name }) // ✅ thêm dòng này
  role: Role;

  @Prop({ default: false })
  securityConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
