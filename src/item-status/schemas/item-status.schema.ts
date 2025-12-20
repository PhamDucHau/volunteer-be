import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'itemstatuses' })
export class ItemStatus extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g. "Mới 100%", "Đã qua sử dụng", "Hư hỏng 1 phần"

  @Prop()
  description?: string; // Optional: detail meaning of the status

  @Prop({ default: false })
  isFinal?: boolean; // true = completed state (no further actions)

  @Prop({ default: false })
  deleted: boolean;
}

export const ItemStatusSchema = SchemaFactory.createForClass(ItemStatus);

