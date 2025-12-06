import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { DonateItem } from '../../donate-item/schemas/donation-item.schema';

@Schema({ collection: 'trackings', timestamps: true })
export class Tracking extends Document {
  // 🔗 Liên kết donate item
  @Prop({ type: Types.ObjectId, ref: DonateItem.name, required: true })
  donateItem: DonateItem;

  // 📝 Hành động: 'created', 'updated', 'completed', 'deleted', etc.
  @Prop({ required: true })
  action: string;

  // 👤 Người thực hiện hành động
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  // 📋 Metadata bổ sung (có thể lưu thông tin chi tiết)
  @Prop({ type: Object })
  metadata?: {
    [key: string]: any;
  };

  // 🕒 Ngày tạo & cập nhật tự động
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);

