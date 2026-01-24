import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report, ReportSchema } from './schemas/report.schema';
import { DonateItem, DonateItemSchema } from '../donate-item/schemas/donation-item.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { DonationCampaign, DonationCampaignSchema } from '../donation-campaign/schemas/donation-campaign.schema';
import { ItemCategory, ItemCategorySchema } from '../item-category/schemas/item-category.schema';
import { Status, StatusSchema } from '../donate-item/schemas/status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: DonateItem.name, schema: DonateItemSchema },
      { name: User.name, schema: UserSchema },
      { name: DonationCampaign.name, schema: DonationCampaignSchema },
      { name: ItemCategory.name, schema: ItemCategorySchema },
      { name: Status.name, schema: StatusSchema },
    ])
  ],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}

