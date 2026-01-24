import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Role } from '../auth/schemas/role.schema';
// Note: For production, consider using bcrypt for password hashing
// import * as bcrypt from 'bcrypt';

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
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  // 🟢 Lấy tất cả users với phân trang và search
  async findAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  }) {
    const isGetAll = query.page === 'all';
    const page = isGetAll ? 1 : parseInt(query.page) || 1;
    const limit = isGetAll
      ? Number.MAX_SAFE_INTEGER
      : parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tạo filter
    const filter: any = {};

    // Filter theo role nếu có
    if (query.role) {
      filter.role = new Types.ObjectId(query.role);
    }

    // Nếu có search, filter ở application level để hỗ trợ search không dấu
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim().toLowerCase();
      const normalizedSearch = removeVietnameseTones(searchTerm);

      // Lấy tất cả documents (không có pagination ở DB level)
      const allUsers = await this.userModel
        .find(filter)
        .populate('role', 'name')
        .sort({ createdAt: -1 })
        .exec();

      // Filter ở application level: so sánh cả name và email
      const filteredUsers = allUsers.filter((user) => {
        const userNameNormalized = removeVietnameseTones(
          user.name.toLowerCase(),
        );
        const userNameLower = user.name.toLowerCase();
        const userEmailLower = user.email.toLowerCase();

        // Match nếu name hoặc email (có dấu hoặc không dấu) chứa search term
        return (
          userNameLower.includes(searchTerm) ||
          userNameNormalized.includes(normalizedSearch) ||
          userEmailLower.includes(searchTerm)
        );
      });

      // Nếu page=all, trả về toàn bộ không phân trang
      if (isGetAll) {
        return {
          data: filteredUsers,
          pagination: {
            total: filteredUsers.length,
            page: 1,
            limit: filteredUsers.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      // Apply pagination sau khi filter
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const data = filteredUsers.slice(skip, skip + limit);

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
    const total = await this.userModel.countDocuments(filter);

    // Nếu page=all, lấy tất cả không phân trang
    if (isGetAll) {
      const data = await this.userModel
        .find(filter)
        .populate('role', 'name')
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
    const data = await this.userModel
      .find(filter)
      .populate('role', 'name')
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

  // 🟢 Lấy user theo ID
  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('role', 'name')
      .exec();

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return user;
  }

  // 🟢 Tạo mới user
  async create(data: {
    name: string;
    email: string;
    password?: string;
    uid?: string;
    role?: string;
    securityConfirmed?: boolean;
  }) {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await this.userModel.findOne({ email: data.email });

      if (existingUser) {
        throw new BadRequestException(`Email "${data.email}" đã tồn tại`);
      }

      // Kiểm tra uid đã tồn tại chưa (nếu có)
      if (data.uid) {
        const existingUid = await this.userModel.findOne({ uid: data.uid });
        if (existingUid) {
          throw new BadRequestException(`UID "${data.uid}" đã tồn tại`);
        }
      }

      // Store password (for production, use bcrypt to hash)
      // if (data.password) {
      //   hashedPassword = await bcrypt.hash(data.password, 10);
      // }
      const hashedPassword = data.password;

      // Kiểm tra role có tồn tại không (nếu có)
      if (data.role) {
        const roleExists = await this.roleModel.findById(data.role);
        if (!roleExists) {
          throw new BadRequestException('Role không tồn tại');
        }
      }

      const newUser = new this.userModel({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        uid: data.uid,
        role: data.role ? new Types.ObjectId(data.role) : undefined,
        securityConfirmed: data.securityConfirmed || false,
      });

      const savedUser = await newUser.save();

      // Populate role khi trả về
      return this.userModel
        .findById(savedUser._id)
        .populate('role', 'name')
        .exec();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Tạo user thất bại');
    }
  }

  // 🟡 Cập nhật user
  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      uid?: string;
      role?: string;
      securityConfirmed?: boolean;
    },
  ) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('Không tìm thấy user');
      }

      // Kiểm tra email mới có trùng với user khác không
      if (data.email && data.email !== user.email) {
        const existing = await this.userModel.findOne({
          email: data.email,
          _id: { $ne: id },
        });

        if (existing) {
          throw new BadRequestException(`Email "${data.email}" đã tồn tại`);
        }
      }

      // Kiểm tra uid mới có trùng với user khác không (nếu có)
      if (data.uid && data.uid !== user.uid) {
        const existingUid = await this.userModel.findOne({
          uid: data.uid,
          _id: { $ne: id },
        });

        if (existingUid) {
          throw new BadRequestException(`UID "${data.uid}" đã tồn tại`);
        }
      }

      // Kiểm tra role có tồn tại không (nếu có)
      if (data.role) {
        const roleExists = await this.roleModel.findById(data.role);
        if (!roleExists) {
          throw new BadRequestException('Role không tồn tại');
        }
      }

      // Hash password mới nếu có (for production, use bcrypt)
      // if (data.password) {
      //   data.password = await bcrypt.hash(data.password, 10);
      // }

      // Cập nhật các field
      if (data.name) user.name = data.name;
      if (data.email) user.email = data.email;
      if (data.password) user.password = data.password;
      if (data.uid !== undefined) user.uid = data.uid;
      if (data.role) user.role = new Types.ObjectId(data.role) as any;
      if (data.securityConfirmed !== undefined)
        user.securityConfirmed = data.securityConfirmed;

      await user.save();

      // Populate role khi trả về
      return this.userModel
        .findById(user._id)
        .populate('role', 'name')
        .exec();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Cập nhật user thất bại');
    }
  }

  // 🔴 Xóa user
  async delete(id: string) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('Không tìm thấy user');
      }

      await this.userModel.findByIdAndDelete(id);

      return { message: 'Xóa user thành công', id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Xóa user thất bại');
    }
  }

  // 🟢 Lấy tất cả roles
  async findAllRoles() {
    try {
      const roles = await this.roleModel.find().sort({ name: 1 }).exec();
      return {
        message: 'Danh sách roles',
        data: roles,
        total: roles.length,
      };
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách roles');
    }
  }

  // 🟢 Kiểm tra trạng thái securityConfirmed của user hiện tại
  async checkSecurityStatus(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).select('securityConfirmed name email');
      
      if (!user) {
        throw new NotFoundException('Không tìm thấy user');
      }

      return {
        message: 'Trạng thái xác thực bảo mật',
        data: {
          email: user.email,
          name: user.name,
          securityConfirmed: user.securityConfirmed,
          requiresVerification: !user.securityConfirmed, // Nếu false thì cần xác thực thêm
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Không thể kiểm tra trạng thái bảo mật');
    }
  }

  // 🟡 Cập nhật securityConfirmed (không cần verify password)
  async updateSecurityConfirm(
    email: string,
    data: { securityConfirmed: boolean },
  ) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('Không tìm thấy user');
      }

      // Cập nhật trạng thái (không cần verify password)
      user.securityConfirmed = data.securityConfirmed;
      await user.save();

      return {
        message: data.securityConfirmed
          ? 'Đã bật xác thực bảo mật thành công'
          : 'Đã tắt xác thực bảo mật',
        data: {
          email: user.email,
          securityConfirmed: user.securityConfirmed,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Không thể cập nhật trạng thái bảo mật');
    }
  }
}

