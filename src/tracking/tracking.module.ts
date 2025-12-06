import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './schemas/tracking.schema';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
    AuthModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService], // Export để các module khác có thể dùng
})
export class TrackingModule {}

