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
import { ItemStatusService } from './item-status.service';

@UseGuards(AuthGuard)
@Controller('/item-statuses')
export class ItemStatusController {
  constructor(private readonly itemStatusService: ItemStatusService) {}

  // 🟢 GET all item statuses với phân trang và search
  // Query params:
  //   - ?page=1&limit=10&search=tên (có phân trang)
  //   - ?page=all&search=tên (lấy tất cả, không phân trang)
  @Get()
  async getAllItemStatuses(
    @Query() query: { page?: string; limit?: string; search?: string },
  ) {
    return this.itemStatusService.findAll(query);
  }

  // 🟢 POST - Tạo mới item status
  @Post()
  async createItemStatus(
    @Body()
    body: {
      name: string;
      description?: string;
      isFinal?: boolean;
    },
  ) {
    return this.itemStatusService.create(body);
  }

  // 🟡 PUT - Cập nhật item status
  @Put(':id')
  async updateItemStatus(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      isFinal?: boolean;
    },
  ) {
    return this.itemStatusService.update(id, body);
  }

  // 🔴 DELETE - Xóa item status (soft delete)
  @Delete(':id')
  async deleteItemStatus(@Param('id') id: string) {
    return this.itemStatusService.delete(id);
  }
}

