import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tracking } from './schemas/tracking.schema';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<Tracking>,
  ) {}

  /**
   * Tạo tracking record
   * @param donateItemId ID của donate item
   * @param userId ID của user thực hiện hành động
   * @param action Hành động: 'created', 'updated', 'completed', etc.
   * @param metadata Thông tin bổ sung (optional)
   */
  async create(
    donateItemId: string,
    userId: string,
    action: string,
    metadata?: any,
  ): Promise<Tracking> {
    const tracking = new this.trackingModel({
      donateItem: donateItemId,
      user: userId,
      action,
      metadata: metadata || {},
    });

    return tracking.save();
  }

  /**
   * Lấy lịch sử tracking theo donate item ID
   */
  async findByDonateItemId(donateItemId: string) {
    return this.trackingModel
      .find({ donateItem: donateItemId })
      .populate('user', 'name email')
      .populate('donateItem', 'itemName')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Lấy lịch sử tracking theo user ID
   */
  async findByUserId(userId: string) {
    return this.trackingModel
      .find({ user: userId })
      .populate('user', 'name email')
      .populate('donateItem', 'itemName')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Lấy tất cả tracking records
   */
  async findAll() {
    return this.trackingModel
      .find()
      .populate('user', 'name email')
      .populate('donateItem', 'itemName')
      .sort({ createdAt: -1 })
      .exec();
  }
}

