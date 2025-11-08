import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ItemStatus extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g. "Registered Donation", "Donation Completed"

  @Prop()
  description?: string; // Optional: detail meaning of the status

  @Prop({ default: false })
  isFinal?: boolean; // true = completed state (no further actions)
}

export const ItemStatusSchema = SchemaFactory.createForClass(ItemStatus);
