import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const { attachments, ...restPayload } = createReportDto;
    let normalizedAttachments: string[] = [];

    if (Array.isArray(attachments)) {
      normalizedAttachments = attachments;
    } else if (typeof attachments === 'string' && attachments.trim().length) {
      const trimmed = attachments.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            normalizedAttachments = parsed;
          }
        } catch {
          normalizedAttachments = trimmed ? [trimmed] : [];
        }
      } else if (trimmed.includes(',')) {
        normalizedAttachments = trimmed
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      } else {
        normalizedAttachments = [trimmed];
      }
    }

    const createdReport = new this.reportModel({
      ...restPayload,
      attachments: normalizedAttachments
    });

    return createdReport.save();
  }

  async findAll() {
    return this.reportModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`Không tìm thấy báo cáo với ID: ${id}`);
    }
    return report;
  }
}

