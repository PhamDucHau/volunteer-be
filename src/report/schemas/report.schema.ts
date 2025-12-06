import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'reports', timestamps: true })
export class Report extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: 'pending', trim: true })
  status: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

