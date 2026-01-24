import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🟢 GET all users với phân trang và search
  // Query params:
  //   - ?page=1&limit=10&search=tên (có phân trang)
  //   - ?page=all&search=tên (lấy tất cả, không phân trang)
  @Get()
  async getAllUsers(
    @Query() query: { page?: string; limit?: string; search?: string; role?: string },
  ) {
    return this.userService.findAll(query);
  }

  // 🟢 GET all roles
  @Get('roles')
  async getAllRoles() {
    return this.userService.findAllRoles();
  }

  // 🟢 GET check securityConfirmed status của user hiện tại
  @Get('me/security-status')
  async checkSecurityStatus(@Req() req) {
    const email = req.email; // Lấy từ token qua AuthGuard
    return this.userService.checkSecurityStatus(email);
  }

  // 🟡 PUT update securityConfirmed
  @Put('me/security-confirm')
  async updateSecurityConfirm(
    @Req() req,
    @Body() body: { securityConfirmed: boolean },
  ) {
    const email = req.email; // Lấy từ token qua AuthGuard
    return this.userService.updateSecurityConfirm(email, body);
  }

  // 🟢 GET user by ID
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // 🟢 POST - Tạo mới user
  @Post()
  async createUser(
    @Body()
    body: {
      name: string;
      email: string;
      password?: string;
      uid?: string;
      role?: string;
      securityConfirmed?: boolean;
    },
  ) {
    return this.userService.create(body);
  }

  // 🟡 PUT - Cập nhật user
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      password?: string;
      uid?: string;
      role?: string;
      securityConfirmed?: boolean;
    },
  ) {
    return this.userService.update(id, body);
  }

  // 🔴 DELETE - Xóa user
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}

