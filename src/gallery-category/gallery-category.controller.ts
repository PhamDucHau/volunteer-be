import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { GalleryCategoryService } from './gallery-category.service';

// @UseGuards(AuthGuard)
@Controller('/gallery-categories')
export class GalleryCategoryController {
  constructor(private readonly galleryCategoryService: GalleryCategoryService) {}

  // 🟢 GET all gallery categories với phân trang và search
  // Query params: 
  //   - ?page=1&limit=10&search=tên (có phân trang)
  //   - ?page=all&search=tên (lấy tất cả, không phân trang)
  @Get()
  async getAllCategories(@Query() query: { page?: string; limit?: string; search?: string }) {
    return this.galleryCategoryService.findAll(query);
  }

  // 🟢 POST - Tạo mới category
  @Post()
  async createCategory(@Body() body: { name: string; description?: string }) {
    return this.galleryCategoryService.create(body);
  }

  // 🟡 PUT - Cập nhật category
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.galleryCategoryService.update(id, body);
  }

  // 🔴 DELETE - Xóa category (soft delete)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.galleryCategoryService.delete(id);
  }
}

