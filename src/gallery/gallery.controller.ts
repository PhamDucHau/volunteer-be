import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { GalleryService } from './gallery.service';

// @UseGuards(AuthGuard)
@Controller('/galleries')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // 🟢 GET all gallery items với phân trang, search và filter
  // Query params:
  //   - ?page=1&limit=10&search=tên&category=id (có phân trang)
  //   - ?page=all&search=tên&category=id (lấy tất cả, không phân trang)
  @Get()
  async getAllGalleries(
    @Query() query: { page?: string; limit?: string; search?: string; category?: string },
  ) {
    return this.galleryService.findAll(query);
  }

  // 🟢 GET gallery item theo ID
  @Get(':id')
  async getGalleryById(@Param('id') id: string) {
    return this.galleryService.findById(id);
  }

  // 🟢 POST - Tạo mới gallery item
  @Post()
  async createGallery(
    @Body()
    body: {
      image: string;
      category: string;
      title: string;
      description: string;
      date?: Date;
      views?: number;
    },
  ) {
    return this.galleryService.create(body);
  }

  // 🟡 PUT - Cập nhật gallery item
  @Put(':id')
  async updateGallery(
    @Param('id') id: string,
    @Body()
    body: {
      image?: string;
      category?: string;
      title?: string;
      description?: string;
      date?: Date;
      views?: number;
    },
  ) {
    return this.galleryService.update(id, body);
  }

  // 🔴 DELETE - Xóa gallery item (soft delete)
  @Delete(':id')
  async deleteGallery(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }

  // 🟢 POST - Tăng lượt xem
  @Post(':id/views')
  async incrementViews(@Param('id') id: string) {
    return this.galleryService.incrementViews(id);
  }
}

