import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import axios from "axios";
import { DonateItem } from './schemas/donation-item.schema';
import { DonationCampaign } from './schemas/donation-campaign.schema';
import { ItemCategory } from './schemas/item-category.schema';
import { ItemStatus } from './schemas/item-status.schema';
import { Status } from './schemas/status.schema';
import { User } from 'src/auth/schemas/user.schema';
import { TrackingService } from 'src/tracking/tracking.service';


@Injectable()
export class DonateItemService {
  constructor(
    @InjectModel(DonateItem.name) private donateItemModel: Model<DonateItem>,
    @InjectModel(DonationCampaign.name)
    private readonly donationCampaignModel: Model<DonationCampaign>,
    @InjectModel(ItemCategory.name)
    private readonly itemCategoryModel: Model<ItemCategory>,
    @InjectModel(ItemStatus.name)
    private readonly itemStatusModel: Model<ItemStatus>,
    @InjectModel(Status.name)
    private readonly statusModel: Model<Status>,
    @InjectModel(User.name) private userModel: Model<User>,
    private trackingService: TrackingService,
    private jwtService: JwtService,) { }


     // 🟢 Tạo mới donate item
  async create(email: string,data: any) {
    console.log('email', email);

    const user = await this.userModel.findOne({ email });
    console.log('user._id', user._id);
      if (!user) {
        throw new NotFoundException(`Không tìm thấy user với email: ${email}`);
      }
      // ⚙️ 2️⃣ Gắn mặc định status = "Đăng ký cho"
      const defaultStatusId = '690e55cca230c15861dcdd21';

    try {
      const newItem = new this.donateItemModel({
        itemName: data.itemName,
        itemDescription: data.itemDescription,
        quantity: data.quantity,
        itemCategory: data.itemCategory ,
        donationCampaign: data.donationCampaign ,
        sender: user._id.toString(),
        receiver: data.receiver ,
        status: defaultStatusId,
        itemStatus: data.itemStatus ,
        senderInfo: data.senderInfo,
        receiverInfo: data.receiverInfo,
        itemImages: data.itemImages,
      });

      const savedItem = await newItem.save();

      // 📝 Tạo tracking record để lưu lịch sử
      try {
        await this.trackingService.create(
          savedItem._id.toString(),
          user._id.toString(),
          'created',
          {
            itemName: savedItem.itemName,
            quantity: savedItem.quantity,
          },
        );
      } catch (trackingError) {
        console.error('❌ Error creating tracking:', trackingError);
        // Không throw error để không ảnh hưởng đến việc tạo donate item
      }

      // populate để trả về thông tin chi tiết
      return this.donateItemModel
        .findById(savedItem._id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('itemCategory', 'name')
        .populate('donationCampaign', 'name')
        .populate('status', 'name')
        .populate('itemStatus', 'name')
        .exec();
    } catch (error) {
      console.error('Error creating donate item:', error);
      throw new Error('Tạo vật phẩm thất bại');
    }
  }


    // 🟢 Lấy danh sách (có filter)
  async findAll(query: any) {
    const filters: any = {};

    if (query.status) filters.status = query.status;
    if (query.donationCampaign) filters.donationCampaign = query.donationCampaign;
    if (query.itemCategory) filters.itemCategory = query.itemCategory;
    console.log('filters', filters);

    // populate để hiển thị đầy đủ thông tin liên kết
    return this.donateItemModel
      .find(filters)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('itemCategory', 'name')
      .populate('donationCampaign', 'name')
      .populate('status', 'name')
      .populate('itemStatus', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  // 🟡 UPDATE (dùng lại cho POST /update/:id)
  async update(id: string, data: any, email: string) {
    try {
      // ✅ Chuẩn bị dữ liệu cập nhật
      const updateData: any = {
        itemName: data.itemName,
        itemDescription: data.itemDescription,
        quantity: data.quantity,
        itemImages: data.itemImages,
      };

      // Gắn các field động
      if (data.itemCategory) updateData.itemCategory = data.itemCategory;
      if (data.donationCampaign) updateData.donationCampaign = data.donationCampaign;
      if (data.sender) updateData.sender = data.sender;
      if (data.receiver) updateData.receiver = data.receiver;
      if (data.status) updateData.status = data.status;
      if (data.itemStatus) updateData.itemStatus = data.itemStatus;
      if (data.senderInfo) updateData.senderInfo = data.senderInfo;
      if (data.receiverInfo) updateData.receiverInfo = data.receiverInfo;
      if (data.lastReceiveDate) updateData.lastReceiveDate = data.lastReceiveDate;

      // 🧩 Cập nhật vào DB
      const updated = await this.donateItemModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        throw new NotFoundException('Không tìm thấy vật phẩm để cập nhật');
      }

      // ✅ Populate đầy đủ thông tin trả về
      return this.donateItemModel
        .findById(updated._id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('itemCategory', 'name')
        .populate('donationCampaign', 'name')
        .populate('status', 'name')
        .populate('itemStatus', 'name')
        .exec();
    } catch (error) {
      console.error('❌ Error updating donate item:', error);
      throw new Error('Cập nhật vật phẩm thất bại');
    }
  }

  async completeDonation(id: string, email: string, body: any) {
    try {
      console.log('📩 Email từ token:', email);
      console.log('📦 Item cần cập nhật:', id);

      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException(`Không tìm thấy user với email: ${email}`);

      const item = await this.donateItemModel.findById(id);
      if (!item) throw new NotFoundException('Không tìm thấy vật phẩm để cập nhật');

      if (item.sender?.toString() === user._id.toString()) {
        throw new BadRequestException('Bạn không thể nhận vật phẩm của chính mình');
      }


      const updateData: any = {
        receiver: user._id.toString(),
      };
      updateData.status = '690e55cca230c15861dcdd22'
      if (body.receiverInfo) updateData.receiverInfo = body.receiverInfo;
      if (body.itemStatus) updateData.itemStatus = new Types.ObjectId(body.itemStatus);

      console.log('🧠 Update data:', updateData);

      const updated = await this.donateItemModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) throw new NotFoundException('Không tìm thấy vật phẩm để cập nhật');

      return this.donateItemModel
        .findById(updated._id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .populate('itemCategory', 'name')
        .populate('donationCampaign', 'name')
        .populate('status', 'name')
        .populate('itemStatus', 'name')
        .exec();
    } catch (error) {
      console.error('❌ Error completing donation:', error.message);
      console.error('🔥 Stack:', error.stack);
      throw new InternalServerErrorException(`Cập nhật vật phẩm thất bại: ${error.message}`);
    }
  }


  async findAllBySender(email: string) {
    // Tìm user theo email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với email: ${email}`);
    }

    // Lọc các donation item có sender = user._id
    return this.donateItemModel
      .find({ sender: user._id.toString() })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('itemCategory', 'name')
      .populate('donationCampaign', 'name')
      .populate('status', 'name')
      .populate('itemStatus', 'name')
      .sort({ createdAt: -1 }) // mới nhất trước
      .exec();
  }

  async findAllByReceiver(email: string) {
    // 🔍 Tìm user theo email từ token
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với email: ${email}`);
    }

    // 🧩 Lọc các item có receiver = user._id
    return this.donateItemModel
      .find({ receiver: user._id.toString() })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('itemCategory', 'name')
      .populate('donationCampaign', 'name')
      .populate('status', 'name')
      .populate('itemStatus', 'name')
      .sort({ createdAt: -1 }) // mới nhất trước
      .exec();
  }



  // 🟢 Lấy 1 vật phẩm cụ thể
  async findById(id: string) {
    return this.donateItemModel
      .findById(id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('itemCategory', 'name')
      .populate('donationCampaign', 'name')
      .populate('status', 'name')
      .populate('itemStatus', 'name')
      .exec();
  }


  async delete(id: string) {
    const deleted = await this.donateItemModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy vật phẩm để xóa');
    return { message: 'Xóa vật phẩm thành công', id };
  }






// 🧩 GET all donation campaigns
async findAllCampaigns() {
  return this.donationCampaignModel.find();
}

// 🧩 GET all item categories
async findAllCategories() {
  return this.itemCategoryModel.find();
}

// 🧩 GET all item statuses
async findAllItemStatuses() {
  return this.itemStatusModel.find();
}

// 🧩 GET all status chung
async findAllStatus() {
  return this.statusModel.find();
}















}
