import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemCategoryController } from './item-category.controller';
import { ItemCategoryService } from './item-category.service';
import { ItemCategory, ItemCategorySchema } from './schemas/item-category.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemCategory.name, schema: ItemCategorySchema },
    ]),
    AuthModule,
  ],
  controllers: [ItemCategoryController],
  providers: [ItemCategoryService],
  exports: [ItemCategoryService], // Export để các module khác có thể dùng
})
export class ItemCategoryModule {}

