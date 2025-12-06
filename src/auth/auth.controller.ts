import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { HttpService } from '@nestjs/axios';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from "axios";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly httpService: HttpService) { }
  @Post('create')
  async createUser(@Body() body: any) {
    if (body.uid) {
      // Tạo user qua Firebase
      const { uid, email, name } = body;
      return this.authService.createUserWithFirebase({ uid, email, name });
    } else {
      // Tạo user qua form đăng ký
      const { name, email, password, securityConfirmed } = body;
      return this.authService.createUserWithForm({ name, email, password, securityConfirmed });
    }
  }
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Get('role')
async getRoles() {
  return this.authService.getRoles();
}










}
