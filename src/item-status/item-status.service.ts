import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemStatus } from './schemas/item-status.schema';

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
export class ItemStatusService {
  constructor(
    @InjectModel(ItemStatus.name)
    private readonly itemStatusModel: Model<ItemStatus>,
  ) {}

  // 🟢 Lấy tất cả item statuses (chỉ những status chưa bị xóa) với phân trang và search
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
      const allStatuses = await this.itemStatusModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();

      // Filter ở application level: so sánh cả name gốc và name đã normalize
      const filteredStatuses = allStatuses.filter((status) => {
        const statusNameNormalized = removeVietnameseTones(
          status.name.toLowerCase(),
        );
        const statusNameLower = status.name.toLowerCase();

        // Match nếu status name (có dấu hoặc không dấu) chứa search term (có dấu hoặc không dấu)
        return (
          statusNameLower.includes(searchTerm) ||
          statusNameNormalized.includes(normalizedSearch)
        );
      });

      // Nếu page=all, trả về toàn bộ không phân trang
      if (isGetAll) {
        return {
          data: filteredStatuses,
          pagination: {
            total: filteredStatuses.length,
            page: 1,
            limit: filteredStatuses.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Apply pagination sau khi filter
      const total = filteredStatuses.length;
      const totalPages = Math.ceil(total / limit);
      const data = filteredStatuses.slice(skip, skip + limit);

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
    const total = await this.itemStatusModel.countDocuments(filter);

    // Nếu page=all, lấy tất cả không phân trang
    if (isGetAll) {
      const data = await this.itemStatusModel
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
    const data = await this.itemStatusModel
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

  // 🟢 Tạo mới item status
  async create(data: {
    name: string;
    description?: string;
    isFinal?: boolean;
  }) {
    try {
      // Kiểm tra xem status đã tồn tại chưa (kể cả đã bị xóa)
      const existing = await this.itemStatusModel.findOne({ name: data.name });

      if (existing) {
        // Nếu đã tồn tại và chưa bị xóa
        if (!existing.deleted) {
          throw new BadRequestException(`Trạng thái "${data.name}" đã tồn tại`);
        }
        // Nếu đã bị xóa, khôi phục lại
        existing.deleted = false;
        if (data.description) existing.description = data.description;
        if (data.isFinal !== undefined) existing.isFinal = data.isFinal;
        return existing.save();
      }

      const newStatus = new this.itemStatusModel({
        name: data.name,
        description: data.description,
        isFinal: data.isFinal !== undefined ? data.isFinal : false,
        deleted: false,
      });

      return newStatus.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Tạo trạng thái thất bại');
    }
  }

  // 🟡 Cập nhật item status
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      isFinal?: boolean;
    },
  ) {
    try {
      const status = await this.itemStatusModel.findById(id);

      if (!status) {
        throw new NotFoundException('Không tìm thấy trạng thái');
      }

      if (status.deleted) {
        throw new NotFoundException('Trạng thái này đã bị xóa');
      }

      // Kiểm tra tên mới có trùng với status khác không
      if (data.name && data.name !== status.name) {
        const existing = await this.itemStatusModel.findOne({
          name: data.name,
          _id: { $ne: id },
          deleted: false,
        });

        if (existing) {
          throw new BadRequestException(`Trạng thái "${data.name}" đã tồn tại`);
        }
      }

      // Cập nhật các field
      if (data.name) status.name = data.name;
      if (data.description !== undefined) status.description = data.description;
      if (data.isFinal !== undefined) status.isFinal = data.isFinal;

      return status.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Cập nhật trạng thái thất bại');
    }
  }

  // 🔴 Xóa item status (soft delete - chuyển deleted từ false sang true)
  async delete(id: string) {
    try {
      const status = await this.itemStatusModel.findById(id);

      if (!status) {
        throw new NotFoundException('Không tìm thấy trạng thái');
      }

      if (status.deleted) {
        throw new BadRequestException('Trạng thái này đã bị xóa rồi');
      }

      status.deleted = true;
      await status.save();

      return { message: 'Xóa trạng thái thành công', id };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Xóa trạng thái thất bại');
    }
  }
}

