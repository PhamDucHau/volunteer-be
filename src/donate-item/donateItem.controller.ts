import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { HttpService } from '@nestjs/axios';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from "axios";
import { DonateItemService } from './donateItem.service';
@UseGuards(AuthGuard)
@Controller('/donate-items')
export class DonateItemController {
  constructor(private readonly donateItemService: DonateItemService,private readonly httpService: HttpService) { }
  @Post()
  async create(@Req() req, @Body() body: any) {
    return this.donateItemService.create(req.email,body);
  }
  // 🟢 GET /donate-items?status=...&donationCampaign=...&itemCategory=...
  @Get()
  async getAll(@Query() query: any) {
    return this.donateItemService.findAll(query);
  }

  // 🟢 GET /donate-items/my-donations
@Get('/my-donations')
async getMyDonations(@Req() req) {
  const email = req.email; // 🧩 lấy email từ token decode
  return this.donateItemService.findAllBySender(email);
}

@Get('/my-receives')
async getMyReceives(@Req() req) {
  const email = req.email; // lấy từ token qua AuthGuard
  return this.donateItemService.findAllByReceiver(email);
}

  // 🟢 GET /donate-items/:id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.donateItemService.findById(id);
  }

  // 🟡 Cập nhật (POST thay vì PATCH)
  @Post('update/:id')
async update(@Param('id') id: string, @Body() body: any, @Req() req) {
  const email = req.email; // lấy từ token AuthGuard
  return this.donateItemService.update(id, body, email);
}

// 🟢 Hoàn tất ký gửi vật phẩm (update status + receiver từ token)
@Post('complete/:id')
async completeDonation(@Param('id') id: string, @Req() req, @Body() body: any) {
  const email = req.email; // 🧩 lấy từ token qua AuthGuard
  return this.donateItemService.completeDonation(id, email, body);
}

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.donateItemService.delete(id);
  }






  @Get('/list/campaigns')
  async getAllCampaigns() {
    return this.donateItemService.findAllCampaigns();
  }

  // 🧩 GET all item categories
  @Get('/list/categories')
  async getAllCategories() {
    return this.donateItemService.findAllCategories();
  }

  // 🧩 GET all item statuses
  @Get('/list/item-status')
  async getAllItemStatuses() {
    return this.donateItemService.findAllItemStatuses();
  }

  // 🧩 GET all status (chung)
  @Get('/list/status')
  async getAllStatus() {
    return this.donateItemService.findAllStatus();
  }



}
