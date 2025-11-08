
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import { DonateItem, DonateItemSchema } from './schemas/donation-item.schema';
import { DonateItemController } from './donateItem.controller';
import { DonateItemService } from './donateItem.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: DonateItem.name, schema: DonateItemSchema },
      { name: 'ItemCategory', schema: DonateItemSchema },
      { name: 'Status', schema: DonateItemSchema },
      { name: 'ItemStatus', schema: DonateItemSchema },
      { name: 'DonationCampaign', schema: DonateItemSchema },

    ]),
    HttpModule,
    AuthModule
  ],
  controllers: [DonateItemController],
  providers: [DonateItemService]
})
export class DonateItemModule {}
