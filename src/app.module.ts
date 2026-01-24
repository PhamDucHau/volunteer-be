import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { User, UserSchema } from './auth/schemas/user.schema';
import { CardModule } from './card/card.module';
import { FriendModule } from './auth/socket/friend.module';
import { MinioModule } from './minio/minio.module';
import { DepartmentModule } from './department/department.module';
import { DonateItemModule } from './donate-item/donateItem.module';
import { ReportModule } from './report/report.module';
import { TrackingModule } from './tracking/tracking.module';
import { ItemCategoryModule } from './item-category/item-category.module';
import { DonationCampaignModule } from './donation-campaign/donation-campaign.module';
import { ItemStatusModule } from './item-status/item-status.module';
import { UserModule } from './user/user.module';
import { GalleryCategoryModule } from './gallery-category/gallery-category.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    FriendModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    MongooseModule.forRoot('mongodb://admin:admin123@72.61.125.140:27017/Volunteer?authSource=admin'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('JWT_SECRET'),
      }),
      global: true,
      inject: [ConfigService],
      // secret: '123',
    }),
    AuthModule,
    CardModule,
    DepartmentModule,
    MinioModule,
    DonateItemModule,
    ReportModule,
    TrackingModule,
    ItemCategoryModule,
    DonationCampaignModule,
    ItemStatusModule,
    UserModule,
    GalleryCategoryModule,
    GalleryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
