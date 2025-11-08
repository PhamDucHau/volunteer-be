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

@Module({
  imports: [
    FriendModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    MongooseModule.forRoot('mongodb://admin:admin123@61.28.236.228:27017/Volunteer?authSource=admin'),
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
    DonateItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
