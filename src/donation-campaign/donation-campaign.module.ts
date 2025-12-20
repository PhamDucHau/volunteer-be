import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationCampaignController } from './donation-campaign.controller';
import { DonationCampaignService } from './donation-campaign.service';
import {
  DonationCampaign,
  DonationCampaignSchema,
} from './schemas/donation-campaign.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonationCampaign.name, schema: DonationCampaignSchema },
    ]),
    AuthModule,
  ],
  controllers: [DonationCampaignController],
  providers: [DonationCampaignService],
  exports: [DonationCampaignService], // Export để các module khác có thể dùng
})
export class DonationCampaignModule {}

