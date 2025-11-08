import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ItemCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g. "Clothing", "Books", "Toys", "Electronics"

  @Prop()
  description?: string; // Optional short description

  @Prop()
  icon?: string; // Optional icon name or image URL
}

export const ItemCategorySchema = SchemaFactory.createForClass(ItemCategory);
