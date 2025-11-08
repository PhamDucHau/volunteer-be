import { Controller, Post, Body, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('minio')
export class MinioController {
    constructor(private readonly minioService: MinioService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {    
    const bucketName = 'imagefolder'; // Tên bucket bạn muốn lưu trữ
    const fileUrl = await this.minioService.uploadFile(bucketName, file);
    return { url: fileUrl };
  }

  @Get()
  async getFiles() {
    return 'hello'
  }
}
