import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('trackings')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * GET /trackings
   * Lấy danh sách tracking với các filter tùy chọn
   * Query params:
   * - donateItemId: Lọc theo donate item ID
   * - userId: Lọc theo user ID
   */
  @Get()
  async getAll(@Query() query: any) {
    if (query.donateItemId) {
      return this.trackingService.findByDonateItemId(query.donateItemId);
    }
    if (query.userId) {
      return this.trackingService.findByUserId(query.userId);
    }
    // Nếu không có filter, trả về tất cả (có thể thêm pagination sau)
    return this.trackingService.findAll();
  }
}

