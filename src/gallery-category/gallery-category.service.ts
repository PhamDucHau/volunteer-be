import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryCategory } from './schemas/gallery-category.schema';

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
export class GalleryCategoryService {
  constructor(
    @InjectModel(GalleryCategory.name)
    private readonly galleryCategoryModel: Model<GalleryCategory>,
  ) {}

  // 🟢 Lấy tất cả categories (chỉ những category chưa bị xóa) với phân trang và search
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
      const allCategories = await this.galleryCategoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .exec();

      // Filter ở application level: so sánh cả name gốc và name đã normalize
      const filteredCategories = allCategories.filter((category) => {
        const categoryNameNormalized = removeVietnameseTones(
          category.name.toLowerCase(),
        );
        const categoryNameLower = category.name.toLowerCase();

        // Match nếu category name (có dấu hoặc không dấu) chứa search term (có dấu hoặc không dấu)
        return (
          categoryNameLower.includes(searchTerm) ||
          categoryNameNormalized.includes(normalizedSearch)
        );
      });

      // Nếu page=all, trả về toàn bộ không phân trang
      if (isGetAll) {
        return {
          data: filteredCategories,
          pagination: {
            total: filteredCategories.length,
            page: 1,
            limit: filteredCategories.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Apply pagination sau khi filter
      const total = filteredCategories.length;
      const totalPages = Math.ceil(total / limit);
      const data = filteredCategories.slice(skip, skip + limit);

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
    const total = await this.galleryCategoryModel.countDocuments(filter);

    // Nếu page=all, lấy tất cả không phân trang
    if (isGetAll) {
      const data = await this.galleryCategoryModel
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
    const data = await this.galleryCategoryModel
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

  // 🟢 Tạo mới category
  async create(data: { name: string; description?: string }) {
    try {
      // Kiểm tra xem category đã tồn tại chưa (kể cả đã bị xóa)
      const existing = await this.galleryCategoryModel.findOne({ name: data.name });
      
      if (existing) {
        // Nếu đã tồn tại và chưa bị xóa
        if (!existing.deleted) {
          throw new BadRequestException(`Danh mục "${data.name}" đã tồn tại`);
        }
        // Nếu đã bị xóa, khôi phục lại
        existing.deleted = false;
        if (data.description) existing.description = data.description;
        return existing.save();
      }

      const newCategory = new this.galleryCategoryModel({
        name: data.name,
        description: data.description,
        deleted: false,
      });

      return newCategory.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Tạo danh mục thất bại');
    }
  }

  // 🟡 Cập nhật category
  async update(id: string, data: { name?: string; description?: string }) {
    try {
      const category = await this.galleryCategoryModel.findById(id);
      
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
      }

      if (category.deleted) {
        throw new NotFoundException('Danh mục này đã bị xóa');
      }

      // Kiểm tra tên mới có trùng với category khác không
      if (data.name && data.name !== category.name) {
        const existing = await this.galleryCategoryModel.findOne({ 
          name: data.name,
          _id: { $ne: id },
          deleted: false 
        });
        
        if (existing) {
          throw new BadRequestException(`Danh mục "${data.name}" đã tồn tại`);
        }
      }

      // Cập nhật các field
      if (data.name) category.name = data.name;
      if (data.description !== undefined) category.description = data.description;

      return category.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Cập nhật danh mục thất bại');
    }
  }

  // 🔴 Xóa category (soft delete - chuyển deleted từ false sang true)
  async delete(id: string) {
    try {
      const category = await this.galleryCategoryModel.findById(id);
      
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
      }

      if (category.deleted) {
        throw new BadRequestException('Danh mục này đã bị xóa rồi');
      }

      category.deleted = true;
      await category.save();

      return { message: 'Xóa danh mục thành công', id };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Xóa danh mục thất bại');
    }
  }
}

