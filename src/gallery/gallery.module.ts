import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { GalleryCategory, GalleryCategorySchema } from '../gallery-category/schemas/gallery-category.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: GallerySchema },
      { name: GalleryCategory.name, schema: GalleryCategorySchema },
    ]),
    AuthModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService], // Export để các module khác có thể dùng
})
export class GalleryModule {}

