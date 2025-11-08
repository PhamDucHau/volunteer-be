import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import axios from "axios";
import { FriendGateway } from './socket/friend.gateway';
import { Role } from './schemas/role.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly friendGateway: FriendGateway,
    private jwtService: JwtService,) { }
  async createUserWithFirebase(data: { uid: string; email: string; name: string }) {
    // Kiểm tra xem user đã tồn tại trong MongoDB

    let user = await this.userModel.findOne({ uid: data.uid });
    if (!user) {
      const defaultRole = await this.roleModel.findOne({ name: 'user' });
      // Nếu chưa tồn tại, tạo user mới
      user = new this.userModel({
        uid: data.uid,
        email: data.email,
        name: data.name,
        role: defaultRole?._id,
      });

      // Lưu user mới vào database
      await user.save();
    }

    const payload = { uid: user.uid, email: user.email };
    const token = await this.generateUserTokens(payload);
    return { user, token };
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      if (user.password !== password) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      const payload = { uid: user.uid, email: user.email };
      const token = await this.generateUserTokens(payload);

      return { user, token };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error; // ⚡ Giữ nguyên lỗi gốc
      }
      throw new BadRequestException('Không thể đăng nhập. Vui lòng thử lại sau!');
    }
  }

  async createUserWithForm(data: { name: string; email: string; password: string }) {
    // Kiểm tra xem email đã được sử dụng chưa
    try {
      const existingUser = await this.userModel.findOne({ email: data.email });
      if (existingUser) {
        // throw new Error('Email is already in use');
        throw new UnauthorizedException('Email is already in use');
      }

      // Nếu là user đầu tiên thì gán role admin
    const userCount = await this.userModel.countDocuments();
    console.log('userCount', userCount);
    const roleName = userCount === 0 ? 'admin' : 'user';
    console.log('roleName', roleName);
    const role = await this.roleModel.findOne({ name: roleName });
      // Tạo user mới
      console.log('role', role?._id);
      const newUser = new this.userModel({
        ...data,
        role: role?._id, // ✅ gán roleId
      });
      return newUser.save();
    } catch (error) {
      throw new UnauthorizedException('Email already in use');
    }
  }

  async generateUserTokens(payload) {
    const accessToken = this.jwtService.sign({ payload }, {
      expiresIn: '1h'
    });
    return { accessToken }
  }

  async getRoles() {
    try {
      const roles = await this.roleModel.find();
      return {
        message: 'Danh sách role',
        data: roles,
      };
    } catch (error) {
      throw new Error('Không thể lấy danh sách role');
    }
  }























}
