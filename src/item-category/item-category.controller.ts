import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ItemCategoryService } from './item-category.service';

// @UseGuards(AuthGuard)
@Controller('/item-categories')
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  // 🟢 GET all item categories với phân trang và search
  // Query params: 
  //   - ?page=1&limit=10&search=tên (có phân trang)
  //   - ?page=all&search=tên (lấy tất cả, không phân trang)
  @Get()
  async getAllCategories(@Query() query: { page?: string; limit?: string; search?: string }) {
    return this.itemCategoryService.findAll(query);
  }

  // 🟢 POST - Tạo mới category
  @Post()
  async createCategory(@Body() body: { name: string; description?: string }) {
    return this.itemCategoryService.create(body);
  }

  // 🟡 PUT - Cập nhật category
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.itemCategoryService.update(id, body);
  }

  // 🔴 DELETE - Xóa category (soft delete)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.itemCategoryService.delete(id);
  }
}

