import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'galleries', timestamps: true })
export class Gallery extends Document {
  @Prop({ required: true })
  image: string; // Đường dẫn ảnh

  @Prop({ type: Types.ObjectId, ref: 'GalleryCategory', required: true })
  category: Types.ObjectId; // Reference đến GalleryCategory

  @Prop({ required: true })
  title: string; // Tiêu đề

  @Prop({ required: true })
  description: string; // Mô tả

  @Prop({ default: 0 })
  views: number; // Số lượt xem

  @Prop({ required: true })
  date: Date; // Ngày đăng

  @Prop({ default: false })
  deleted: boolean;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

