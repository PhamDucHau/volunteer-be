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
import { DonationCampaignService } from './donation-campaign.service';

// @UseGuards(AuthGuard)
@Controller('/donation-campaigns')
export class DonationCampaignController {
  constructor(
    private readonly donationCampaignService: DonationCampaignService,
  ) {}

  // 🟢 GET all donation campaigns với phân trang và search
  // Query params:
  //   - ?page=1&limit=10&search=tên (có phân trang)
  //   - ?page=all&search=tên (lấy tất cả, không phân trang)
  @Get()
  async getAllCampaigns(
    @Query() query: { page?: string; limit?: string; search?: string },
  ) {
    return this.donationCampaignService.findAll(query);
  }

  // 🟢 GET all active donation campaigns (isActive: true)
  @Get('/active')
  async getActiveCampaigns() {
    return this.donationCampaignService.findAllActive();
  }

  // 🟢 POST - Tạo mới campaign
  @Post()
  async createCampaign(
    @Body()
    body: {
      name: string;
      description?: string;
      startDate: Date;
      endDate: Date;
      location?: string;
      isActive?: boolean;
    },
  ) {
    return this.donationCampaignService.create(body);
  }

  // 🟡 PUT - Cập nhật campaign
  @Put(':id')
  async updateCampaign(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      location?: string;
      isActive?: boolean;
    },
  ) {
    return this.donationCampaignService.update(id, body);
  }

  // 🔴 DELETE - Xóa campaign (soft delete)
  @Delete(':id')
  async deleteCampaign(@Param('id') id: string) {
    return this.donationCampaignService.delete(id);
  }
}

