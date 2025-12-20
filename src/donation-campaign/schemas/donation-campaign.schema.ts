import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'donationcampaigns' })
export class DonationCampaign extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g. "Sharing Love - Winter 2025"

  @Prop()
  description?: string; // e.g. "A campaign to donate warm clothes to children in remote areas"

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  location?: string; // optional: target region or province

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const DonationCampaignSchema = SchemaFactory.createForClass(DonationCampaign);

