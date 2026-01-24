import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryCategoryController } from './gallery-category.controller';
import { GalleryCategoryService } from './gallery-category.service';
import { GalleryCategory, GalleryCategorySchema } from './schemas/gallery-category.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GalleryCategory.name, schema: GalleryCategorySchema },
    ]),
    AuthModule,
  ],
  controllers: [GalleryCategoryController],
  providers: [GalleryCategoryService],
  exports: [GalleryCategoryService], // Export để các module khác có thể dùng
})
export class GalleryCategoryModule {}

