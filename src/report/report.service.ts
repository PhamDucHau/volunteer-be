import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { DonateItem } from '../donate-item/schemas/donation-item.schema';
import { User } from '../auth/schemas/user.schema';
import { DonationCampaign } from '../donation-campaign/schemas/donation-campaign.schema';
import { ItemCategory } from '../item-category/schemas/item-category.schema';
import { Status } from '../donate-item/schemas/status.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(DonateItem.name) private readonly donateItemModel: Model<DonateItem>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(DonationCampaign.name) private readonly donationCampaignModel: Model<DonationCampaign>,
    @InjectModel(ItemCategory.name) private readonly itemCategoryModel: Model<ItemCategory>,
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const { attachments, ...restPayload } = createReportDto;
    let normalizedAttachments: string[] = [];

    if (Array.isArray(attachments)) {
      normalizedAttachments = attachments;
    } else if (typeof attachments === 'string' && attachments.trim().length) {
      const trimmed = attachments.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            normalizedAttachments = parsed;
          }
        } catch {
          normalizedAttachments = trimmed ? [trimmed] : [];
        }
      } else if (trimmed.includes(',')) {
        normalizedAttachments = trimmed
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      } else {
        normalizedAttachments = [trimmed];
      }
    }

    const createdReport = new this.reportModel({
      ...restPayload,
      attachments: normalizedAttachments
    });

    return createdReport.save();
  }

  async findAll() {
    return this.reportModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`Không tìm thấy báo cáo với ID: ${id}`);
    }
    return report;
  }

  async getSummary() {
    // 1. Tổng quyên góp (số lượng donation items)
    const totalDonations = await this.donateItemModel.countDocuments().exec();

    // 2. Tổng vật phẩm (tổng quantity)
    const totalItemsResult = await this.donateItemModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]).exec();
    const totalItems = totalItemsResult[0]?.total || 0;

    // 3. Tổng người dùng
    const totalUsers = await this.userModel.countDocuments().exec();

    // 4. Tổng chiến dịch (chưa bị xóa)
    const totalCampaigns = await this.donationCampaignModel.countDocuments({ deleted: false }).exec();

    // 5. Quyên góp 7 ngày qua (group by date)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const donationsLast7Days = await this.donateItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%d-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    // Format lại để có đủ 7 ngày
    const last7DaysMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      last7DaysMap.set(dateStr, 0);
    }
    donationsLast7Days.forEach((item) => {
      last7DaysMap.set(item._id, item.count);
    });
    const donations7Days = Array.from(last7DaysMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // 6. Phân bố quyên góp theo loại (by category)
    // Lấy tất cả items có category và populate category
    const itemsWithCategory = await this.donateItemModel
      .find({ itemCategory: { $ne: null } })
      .populate('itemCategory', 'name deleted')
      .exec();

    // Group by category
    const categoryMap = new Map();
    itemsWithCategory.forEach((item: any) => {
      if (item.itemCategory && !item.itemCategory.deleted) {
        const categoryId = item.itemCategory._id.toString();
        const categoryName = item.itemCategory.name;
        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            categoryId,
            categoryName,
            count: 0,
          });
        }
        categoryMap.get(categoryId).count += 1;
      }
    });

    const distributionByCategory = Array.from(categoryMap.values());

    // Tính tổng và phần trăm
    const totalByCategory = distributionByCategory.reduce((sum, item) => sum + item.count, 0);
    const distributionWithPercentage = distributionByCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      count: item.count,
      percentage: totalByCategory > 0 ? Math.round((item.count / totalByCategory) * 100) : 0,
    }));

    // 6b. Phân bố quyên góp theo chiến dịch (by campaign)
    const itemsWithCampaign = await this.donateItemModel
      .find({ donationCampaign: { $ne: null } })
      .populate('donationCampaign', 'name deleted')
      .exec();

    // Group by campaign
    const campaignMap = new Map();
    itemsWithCampaign.forEach((item: any) => {
      if (item.donationCampaign && !item.donationCampaign.deleted) {
        const campaignId = item.donationCampaign._id.toString();
        const campaignName = item.donationCampaign.name;
        if (!campaignMap.has(campaignId)) {
          campaignMap.set(campaignId, {
            campaignId,
            campaignName,
            count: 0,
          });
        }
        campaignMap.get(campaignId).count += 1;
      }
    });

    const distributionByCampaign = Array.from(campaignMap.values());

    // 7. Xu hướng quyên góp theo trạng thái (30 ngày)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Lấy tất cả status để map
    const allStatuses = await this.statusModel.find().exec();
    const statusMap = new Map();
    allStatuses.forEach((status) => {
      statusMap.set(status._id.toString(), status.name);
    });

    const trendByStatus = await this.donateItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            status: '$status',
            date: { $dateToString: { format: '%d/%m', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1, '_id.status': 1 },
      },
    ]).exec();

    // Format lại theo status và date
    const statusTrendMap = new Map();
    allStatuses.forEach((status) => {
      statusTrendMap.set(status._id.toString(), {
        statusId: status._id.toString(),
        statusName: status.name,
        data: [],
      });
    });

    // Tạo danh sách 30 ngày (format: DD/MM với slash để khớp với aggregation)
    const dateList = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dateStr = `${day}/${month}`;
      dateList.push(dateStr);
    }

    // Khởi tạo data cho mỗi status với 30 ngày
    statusTrendMap.forEach((value) => {
      value.data = dateList.map((date) => ({ date, count: 0 }));
    });

    // Điền dữ liệu thực tế
    trendByStatus.forEach((item) => {
      const statusId = item._id.status.toString();
      const date = item._id.date;
      const count = item.count;
      if (statusTrendMap.has(statusId)) {
        const statusData = statusTrendMap.get(statusId);
        const dateIndex = statusData.data.findIndex((d) => d.date === date);
        if (dateIndex !== -1) {
          statusData.data[dateIndex].count = count;
        }
      }
    });

    const statusTrend30Days = Array.from(statusTrendMap.values());

    return {
      summary: {
        totalDonations,
        totalItems,
        totalUsers,
        totalCampaigns,
      },
      charts: {
        donationsLast7Days: donations7Days,
        distributionByCategory: distributionWithPercentage,
        distributionByCampaign: distributionByCampaign,
        statusTrend30Days,
      },
    };
  }

  async getStatusTrend30Days() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Lấy tất cả status
    const allStatuses = await this.statusModel.find().exec();

    // Aggregate donations trong 30 ngày, group by status và date
    // Dùng format DD/MM với slash để khớp với format date trong dateList
    const trendByStatus = await this.donateItemModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            status: '$status',
            date: { $dateToString: { format: '%d/%m', date: '$createdAt' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1, '_id.status': 1 },
      },
    ]).exec();

    // Format lại theo status và date
    const statusTrendMap = new Map();
    allStatuses.forEach((status) => {
      statusTrendMap.set(status._id.toString(), {
        statusId: status._id.toString(),
        statusName: status.name,
        data: [],
      });
    });

    // Tạo danh sách 30 ngày (format: DD/MM với slash)
    const dateList = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dateStr = `${day}/${month}`;
      dateList.push(dateStr);
    }

    // Khởi tạo data cho mỗi status với 30 ngày (mặc định count = 0)
    statusTrendMap.forEach((value) => {
      value.data = dateList.map((date) => ({ date, count: 0 }));
    });

    // Điền dữ liệu thực tế từ aggregation result
    trendByStatus.forEach((item) => {
      // Convert ObjectId sang string để so sánh
      const statusId = item._id.status.toString();
      const date = item._id.date;
      const count = item.count;
      
      if (statusTrendMap.has(statusId)) {
        const statusData = statusTrendMap.get(statusId);
        const dateIndex = statusData.data.findIndex((d) => d.date === date);
        if (dateIndex !== -1) {
          statusData.data[dateIndex].count = count;
        }
      }
    });

    return Array.from(statusTrendMap.values());
  }
}

