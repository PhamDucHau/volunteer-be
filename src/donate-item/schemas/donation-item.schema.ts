import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Status } from './status.schema';
import { ItemCategory } from '../../item-category/schemas/item-category.schema';
import { DonationCampaign } from '../../donation-campaign/schemas/donation-campaign.schema';
import { ItemStatus } from '../../item-status/schemas/item-status.schema';



@Schema({ timestamps: true })
export class DonateItem extends Document {
  @Prop({ required: true })
  itemName: string;

  @Prop()
  itemDescription?: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'ItemCategory' })
  itemCategory: ItemCategory;

  @Prop()
  itemCondition?: string;

   // 🔗 Liên kết chiến dịch
   @Prop({ type: Types.ObjectId, ref: DonationCampaign.name })
   donationCampaign: DonationCampaign;

  // 🔗 Liên kết người gửi (bắt buộc)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: User;

  // 🔗 Liên kết người nhận (có thể null nếu chưa ai đăng ký nhận)
  @Prop({ type: Types.ObjectId, ref: User.name })
  receiver?: User;

  // 🔗 Trạng thái donate
  @Prop({ type: Types.ObjectId, ref: Status.name })
  status?: Status;

  // 🔗 Trạng thái item
  @Prop({ type: Types.ObjectId, ref: ItemStatus.name })
  itemStatus?: ItemStatus;

  // 📦 Thông tin người gửi (địa chỉ, sđt)
  @Prop({
    type: {
      phoneNumber: String,
      deliveryAddress: String,
    },
  })
  senderInfo?: {
    phoneNumber: string;
    deliveryAddress: string;
  };

  // 📦 Thông tin người nhận (địa chỉ, sđt)
  @Prop({
    type: {
      phoneNumber: String,
      deliveryAddress: String,
    },
  })
  receiverInfo?: {
    phoneNumber: string;
    deliveryAddress: string;
  };

  // 🖼️ Danh sách ảnh vật phẩm
  @Prop({ type: [String] })
  itemImages?: string[];

  // 📅 🆕 Ngày nhận cuối cùng
  @Prop({ type: Date })
  lastReceiveDate?: Date;

  // 🕒 Ngày tạo & cập nhật tự động
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const DonateItemSchema = SchemaFactory.createForClass(DonateItem);
