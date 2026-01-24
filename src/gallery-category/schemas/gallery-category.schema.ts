import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'gallerycategories', timestamps: true })
export class GalleryCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g. "places", "tours", "reviews"

  @Prop()
  description?: string; // Optional short description

  @Prop({ default: false })
  deleted: boolean;
}

export const GalleryCategorySchema = SchemaFactory.createForClass(GalleryCategory);

