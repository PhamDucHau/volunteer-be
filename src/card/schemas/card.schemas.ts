import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Card extends Document {
  @Prop({ required: true })
  bank_name: string;

  @Prop({ required: true })
  card_number: string;

  @Prop({ required: true })
  due_date: string;

  @Prop({ required: true })
  remaining_month: string;

  @Prop({ required: true })
  money_per_month: string;

  
}

export const CardSchema = SchemaFactory.createForClass(Card);