import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from './schemas/gallery.schema';
import { GalleryCategory } from '../gallery-category/schemas/gallery-category.schema';

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
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<Gallery>,
    @InjectModel(GalleryCategory.name)
    private readonly galleryCategoryModel: Model<GalleryCategory>,
  ) {}

  // 🟢 Lấy tất cả gallery items (chỉ những item chưa bị xóa) với phân trang, search và filter
  async findAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
  }) {
    const isGetAll = query.page === 'all';
    const page = isGetAll ? 1 : parseInt(query.page) || 1;
    const limit = isGetAll ? Number.MAX_SAFE_INTEGER : parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tạo filter
    const filter: any = { deleted: false };
    if (query.category) {
      filter.category = query.category;
    }

    // Nếu có search, filter ở application level để hỗ trợ search không dấu
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim().toLowerCase();
      const normalizedSearch = removeVietnameseTones(searchTerm);

      // Lấy tất cả documents (không có pagination ở DB level)
      const allGalleries = await this.galleryModel
        .find(filter)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .exec();

      // Filter ở application level: so sánh cả title và description gốc và đã normalize
      const filteredGalleries = allGalleries.filter((gallery) => {
        const titleNormalized = removeVietnameseTones(gallery.title.toLowerCase());
        const titleLower = gallery.title.toLowerCase();
        const descriptionNormalized = gallery.description
          ? removeVietnameseTones(gallery.description.toLowerCase())
          : '';
        const descriptionLower = gallery.description ? gallery.description.toLowerCase() : '';

        // Match nếu title hoặc description (có dấu hoặc không dấu) chứa search term (có dấu hoặc không dấu)
        return (
          titleLower.includes(searchTerm) ||
          titleNormalized.includes(normalizedSearch) ||
          descriptionLower.includes(searchTerm) ||
          descriptionNormalized.includes(normalizedSearch)
        );
      });

      // Nếu page=all, trả về toàn bộ không phân trang
      if (isGetAll) {
        return {
          data: filteredGalleries,
          pagination: {
            total: filteredGalleries.length,
            page: 1,
            limit: filteredGalleries.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Apply pagination sau khi filter
      const total = filteredGalleries.length;
      const totalPages = Math.ceil(total / limit);
      const data = filteredGalleries.slice(skip, skip + limit);

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
    const total = await this.galleryModel.countDocuments(filter);

    // Nếu page=all, lấy tất cả không phân trang
    if (isGetAll) {
      const data = await this.galleryModel
        .find(filter)
        .populate('category', 'name')
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
    const data = await this.galleryModel
      .find(filter)
      .populate('category', 'name')
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

  // 🟢 Lấy gallery item theo ID
  async findById(id: string) {
    const gallery = await this.galleryModel
      .findById(id)
      .populate('category', 'name description')
      .exec();

    if (!gallery || gallery.deleted) {
      throw new NotFoundException('Không tìm thấy gallery item');
    }

    return gallery;
  }

  // 🟢 Tạo mới gallery item
  async create(data: {
    image: string;
    category: string;
    title: string;
    description: string;
    date?: Date;
    views?: number;
  }) {
    try {
      // Kiểm tra category có tồn tại không
      const category = await this.galleryCategoryModel.findById(data.category);
      if (!category || category.deleted) {
        throw new NotFoundException('Không tìm thấy category');
      }

      const newGallery = new this.galleryModel({
        image: data.image,
        category: data.category,
        title: data.title,
        description: data.description,
        date: data.date || new Date(),
        views: data.views || 0,
        deleted: false,
      });

      const savedGallery = await newGallery.save();

      // Populate để trả về thông tin chi tiết
      return this.galleryModel
        .findById(savedGallery._id)
        .populate('category', 'name description')
        .exec();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Tạo gallery item thất bại');
    }
  }

  // 🟡 Cập nhật gallery item
  async update(
    id: string,
    data: {
      image?: string;
      category?: string;
      title?: string;
      description?: string;
      date?: Date;
      views?: number;
    },
  ) {
    try {
      const gallery = await this.galleryModel.findById(id);

      if (!gallery) {
        throw new NotFoundException('Không tìm thấy gallery item');
      }

      if (gallery.deleted) {
        throw new NotFoundException('Gallery item này đã bị xóa');
      }

      // Kiểm tra category có tồn tại không (nếu có update category)
      if (data.category && data.category !== gallery.category.toString()) {
        const category = await this.galleryCategoryModel.findById(data.category);
        if (!category || category.deleted) {
          throw new NotFoundException('Không tìm thấy category');
        }
        gallery.category = data.category as any;
      }

      // Cập nhật các field
      if (data.image) gallery.image = data.image;
      if (data.title) gallery.title = data.title;
      if (data.description !== undefined) gallery.description = data.description;
      if (data.date) gallery.date = data.date;
      if (data.views !== undefined) gallery.views = data.views;

      await gallery.save();

      // Populate để trả về thông tin chi tiết
      return this.galleryModel
        .findById(gallery._id)
        .populate('category', 'name description')
        .exec();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Cập nhật gallery item thất bại');
    }
  }

  // 🔴 Xóa gallery item (soft delete - chuyển deleted từ false sang true)
  async delete(id: string) {
    try {
      const gallery = await this.galleryModel.findById(id);

      if (!gallery) {
        throw new NotFoundException('Không tìm thấy gallery item');
      }

      if (gallery.deleted) {
        throw new BadRequestException('Gallery item này đã bị xóa rồi');
      }

      gallery.deleted = true;
      await gallery.save();

      return { message: 'Xóa gallery item thành công', id };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Xóa gallery item thất bại');
    }
  }

  // 🟢 Tăng lượt xem
  async incrementViews(id: string) {
    try {
      const gallery = await this.galleryModel.findById(id);

      if (!gallery || gallery.deleted) {
        throw new NotFoundException('Không tìm thấy gallery item');
      }

      gallery.views = (gallery.views || 0) + 1;
      await gallery.save();

      return gallery;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Cập nhật lượt xem thất bại');
    }
  }
}

