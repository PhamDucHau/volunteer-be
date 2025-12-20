import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonationCampaign } from './schemas/donation-campaign.schema';

// Helper function để loại bỏ dấu tiếng Việt
function removeVietnameseTones(str: string): string {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

@Injectable()
export class DonationCampaignService {
  constructor(
    @InjectModel(DonationCampaign.name)
    private readonly donationCampaignModel: Model<DonationCampaign>,
  ) {}

  // 🟢 Lấy tất cả campaigns (chỉ những campaign chưa bị xóa) với phân trang và search
  async findAll(query: { page?: string; limit?: string; search?: string }) {
    const isGetAll = query.page === 'all';
    const page = isGetAll ? 1 : parseInt(query.page) || 1;
    const limit = isGetAll ? Number.MAX_SAFE_INTEGER : parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tạo filter
    const filter: any = { deleted: false };

    // Nếu có search, filter ở application level để hỗ trợ search không dấu
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim().toLowerCase();
      const normalizedSearch = removeVietnameseTones(searchTerm);

      // Lấy tất cả documents (không có pagination ở DB level)
      const allCampaigns = await this.donationCampaignModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();

      // Filter ở application level: so sánh cả name gốc và name đã normalize
      const filteredCampaigns = allCampaigns.filter((campaign) => {
        const campaignNameNormalized = removeVietnameseTones(
          campaign.name.toLowerCase(),
        );
        const campaignNameLower = campaign.name.toLowerCase();

        // Match nếu campaign name (có dấu hoặc không dấu) chứa search term (có dấu hoặc không dấu)
        return (
          campaignNameLower.includes(searchTerm) ||
          campaignNameNormalized.includes(normalizedSearch)
        );
      });

      // Nếu page=all, trả về toàn bộ không phân trang
      if (isGetAll) {
        return {
          data: filteredCampaigns,
          pagination: {
            total: filteredCampaigns.length,
            page: 1,
            limit: filteredCampaigns.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Apply pagination sau khi filter
      const total = filteredCampaigns.length;
      const totalPages = Math.ceil(total / limit);
      const data = filteredCampaigns.slice(skip, skip + limit);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    // Nếu không có search, dùng cách thông thường với DB query
    const total = await this.donationCampaignModel.countDocuments(filter);

    // Nếu page=all, lấy tất cả không phân trang
    if (isGetAll) {
      const data = await this.donationCampaignModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();

      return {
        data,
        pagination: {
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Có phân trang
    const data = await this.donationCampaignModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // 🟢 Tạo mới campaign
  async create(data: {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    isActive?: boolean;
  }) {
    try {
      // Kiểm tra xem campaign đã tồn tại chưa (kể cả đã bị xóa)
      const existing = await this.donationCampaignModel.findOne({ name: data.name });

      if (existing) {
        // Nếu đã tồn tại và chưa bị xóa
        if (!existing.deleted) {
          throw new BadRequestException(`Chiến dịch "${data.name}" đã tồn tại`);
        }
        // Nếu đã bị xóa, khôi phục lại
        existing.deleted = false;
        if (data.description) existing.description = data.description;
        if (data.startDate) existing.startDate = data.startDate;
        if (data.endDate) existing.endDate = data.endDate;
        if (data.location !== undefined) existing.location = data.location;
        if (data.isActive !== undefined) existing.isActive = data.isActive;
        return existing.save();
      }

      // Kiểm tra endDate phải sau startDate
      if (data.endDate < data.startDate) {
        throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
      }

      const newCampaign = new this.donationCampaignModel({
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        isActive: data.isActive !== undefined ? data.isActive : true,
        deleted: false,
      });

      return newCampaign.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Tạo chiến dịch thất bại');
    }
  }

  // 🟡 Cập nhật campaign
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      location?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const campaign = await this.donationCampaignModel.findById(id);

      if (!campaign) {
        throw new NotFoundException('Không tìm thấy chiến dịch');
      }

      if (campaign.deleted) {
        throw new NotFoundException('Chiến dịch này đã bị xóa');
      }

      // Kiểm tra tên mới có trùng với campaign khác không
      if (data.name && data.name !== campaign.name) {
        const existing = await this.donationCampaignModel.findOne({
          name: data.name,
          _id: { $ne: id },
          deleted: false,
        });

        if (existing) {
          throw new BadRequestException(`Chiến dịch "${data.name}" đã tồn tại`);
        }
      }

      // Kiểm tra endDate phải sau startDate
      const startDate = data.startDate || campaign.startDate;
      const endDate = data.endDate || campaign.endDate;
      if (endDate < startDate) {
        throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
      }

      // Cập nhật các field
      if (data.name) campaign.name = data.name;
      if (data.description !== undefined) campaign.description = data.description;
      if (data.startDate) campaign.startDate = data.startDate;
      if (data.endDate) campaign.endDate = data.endDate;
      if (data.location !== undefined) campaign.location = data.location;
      if (data.isActive !== undefined) campaign.isActive = data.isActive;

      return campaign.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Cập nhật chiến dịch thất bại');
    }
  }

  // 🔴 Xóa campaign (soft delete - chuyển deleted từ false sang true)
  async delete(id: string) {
    try {
      const campaign = await this.donationCampaignModel.findById(id);

      if (!campaign) {
        throw new NotFoundException('Không tìm thấy chiến dịch');
      }

      if (campaign.deleted) {
        throw new BadRequestException('Chiến dịch này đã bị xóa rồi');
      }

      campaign.deleted = true;
      await campaign.save();

      return { message: 'Xóa chiến dịch thành công', id };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Xóa chiến dịch thất bại');
    }
  }
}

