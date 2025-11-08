import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class MinioService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'http://72.60.111.34:9000', // Địa chỉ MinIO
      accessKeyId: 'admin', // Khóa truy cập
      secretAccessKey: 'password123', // Khóa bí mật
      s3ForcePathStyle: true, // MinIO yêu cầu cấu hình này
      signatureVersion: 'v4', // Phiên bản chữ ký
    });

  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    this.s3.listBuckets((err, data) => {
        if (err) {
          console.error('Lỗi kết nối với MinIO:', err);
        } else {
          console.log('Danh sách bucket:', data.Buckets);
        }
      });

    const compressedImage = await sharp(file.buffer)
    .resize(800) // Giữ tỷ lệ và đặt chiều rộng tối đa 800px
    .jpeg({ quality: 80 }) // Chất lượng 80%
    .toBuffer();

    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: compressedImage,
      ContentType: 'image/jpeg',
    };
    console.log('params', params);
    try {
      const data = await this.s3.upload(params).promise();
      console.log('data', data);
      return data.Location; // Trả về URL của file đã tải lên
    } catch (err) {
      throw new Error(`Upload file failed: ${err.message}`);
    }
  }
}
