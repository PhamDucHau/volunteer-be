import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemStatusController } from './item-status.controller';
import { ItemStatusService } from './item-status.service';
import { ItemStatus, ItemStatusSchema } from './schemas/item-status.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemStatus.name, schema: ItemStatusSchema },
    ]),
    AuthModule,
  ],
  controllers: [ItemStatusController],
  providers: [ItemStatusService],
  exports: [ItemStatusService], // Export để các module khác có thể dùng
})
export class ItemStatusModule {}

