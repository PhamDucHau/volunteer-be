import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Status extends Document {
  @Prop({ required: true })
  name: string; // e.g. "Đăng ký cho", "Đã hoàn thành nhận ký gửi"

  @Prop()
  description?: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);
