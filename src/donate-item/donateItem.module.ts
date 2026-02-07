import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { DonateItem, DonateItemSchema } from './schemas/donation-item.schema';
import { Status, StatusSchema } from './schemas/status.schema';
import { DonateItemController } from './donateItem.controller';
import { DonateItemService } from './donateItem.service';
import { AuthModule } from 'src/auth/auth.module';
import { TrackingModule } from 'src/tracking/tracking.module';
import { EmailModule } from '../email/email.module';
import { ItemCategory, ItemCategorySchema } from '../item-category/schemas/item-category.schema';
import { DonationCampaign, DonationCampaignSchema } from '../donation-campaign/schemas/donation-campaign.schema';
import { ItemStatus, ItemStatusSchema } from '../item-status/schemas/item-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonateItem.name, schema: DonateItemSchema },
      { name: ItemCategory.name, schema: ItemCategorySchema },
      { name: DonationCampaign.name, schema: DonationCampaignSchema },
      { name: ItemStatus.name, schema: ItemStatusSchema },
      { name: Status.name, schema: StatusSchema },
    ]),
    HttpModule,
    AuthModule,
    TrackingModule,
    EmailModule,
  ],
  controllers: [DonateItemController],
  providers: [DonateItemService],
})
export class DonateItemModule {}
