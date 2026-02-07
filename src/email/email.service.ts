import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      const user = this.configService.get('GMAIL_USER');
      const appPassword = this.configService.get('GMAIL_APP_PASSWORD');
      
      // Nếu có App Password, dùng cách đơn giản (không cần OAuth)
      if (appPassword) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: user,
            pass: appPassword.replace(/\s/g, ''), // Bỏ dấu cách trong App Password
          },
        });
        this.logger.log('Email transporter initialized successfully (App Password mode)');
        return;
      }

      // Nếu không có App Password, dùng OAuth2 (cần đầy đủ credentials)
      const clientId = this.configService.get('GMAIL_CLIENT_ID');
      const clientSecret = this.configService.get('GMAIL_CLIENT_SECRET');
      const refreshToken = this.configService.get('GMAIL_REFRESH_TOKEN');

      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error(
          'Either GMAIL_APP_PASSWORD or all OAuth2 credentials (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN) must be set in .env file'
        );
      }

      const OAuth2 = google.auth.OAuth2;

      const oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground', // Redirect URL
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const accessToken = await oauth2Client.getAccessToken();

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: user,
          pass: process.env.GMAIL_APP_PASSWORD,
          // clientId: clientId,
          // clientSecret: clientSecret,
          // refreshToken: refreshToken,
          // accessToken: accessToken.token,
        },
      } as nodemailer.TransportOptions);

      this.logger.log('Email transporter initialized successfully (OAuth2 mode)');
    } catch (error) {
      this.logger.error('Failed to initialize email transporter', error);
      throw error;
    }
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      const { to, subject, text, html, cc, bcc } = sendEmailDto;

      const mailOptions = {
        from: `${this.configService.get('GMAIL_USER_NAME') || 'Volunteer System'} <${this.configService.get('GMAIL_USER')}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
        html,
        cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
        bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to ${to}`);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
      };
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Welcome to Volunteer System!</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for joining our volunteer community. We're excited to have you on board!</p>
        <p>You can now start exploring volunteer opportunities and make a difference in your community.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Volunteer System Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to Volunteer System',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Volunteer System Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendDonationConfirmationEmail(
    to: string,
    userName: string,
    donationDetails: any,
  ) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Donation Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your generous donation!</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Donation Details:</h3>
          <p><strong>Campaign:</strong> ${donationDetails.campaignName}</p>
          <p><strong>Items:</strong> ${donationDetails.items}</p>
          <p><strong>Date:</strong> ${donationDetails.date}</p>
        </div>
        <p>Your contribution will make a real difference in our community.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Volunteer System Team</strong></p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Donation Confirmation - Thank You!',
      html,
    });
  }

  /**
   * Gửi thông báo trạng thái vật phẩm theo bảng workflow (Noti người cho / Noti người nhận).
   * type 0: Hủy (gửi cả người cho + người nhận)
   * type 1: Đợi người cho đồng ý → người cho
   * type 2: Đang đợi shipper → người cho
   * type 3: Shipper đang chuyển đến người nhận → người nhận
   * type 4: Hoàn thành → người cho
   */
  async sendItemStatusNotification(
    to: string,
    userName: string,
    itemName: string,
    statusName: string,
    notificationType: 0 | 1 | 2 | 3 | 4,
  ) {
    const baseStyle =
      'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;';
    const boxStyle =
      'background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;';

    const DASHBOARD_HISTORY_URL = 'https://seyeuthuong.org/page-dashboard/my-history';

    const templates: Record<
      number,
      {
        subject: string;
        title: string;
        message: string;
        color: string;
        actionUrl?: string;
        actionLabel?: string;
      }
    > = {
      0: {
        subject: 'Thông báo hủy đơn / Cập nhật trạng thái vật phẩm',
        title: 'Đơn đã được hủy',
        message: `Đơn hàng "<strong>${itemName}</strong>" đã được hủy. Trạng thái: ${statusName}.`,
        color: '#9E9E9E',
      },
      1: {
        subject: 'Có người muốn nhận vật phẩm – Cần bạn đồng ý',
        title: 'Đợi người cho đồng ý',
        message: `Có người nhận đã xác nhận muốn nhận vật phẩm "<strong>${itemName}</strong>". Vui lòng vào hệ thống để đồng ý hoặc từ chối.`,
        color: '#FF9800',
        actionUrl: DASHBOARD_HISTORY_URL,
        actionLabel: 'Vào Hệ thống để đồng ý',
      },
      2: {
        subject: 'Vật phẩm đang chờ bên vận chuyển',
        title: 'Đang đợi shipper / bên vận chuyển',
        message: `Vật phẩm "<strong>${itemName}</strong>" đã được chuyển sang trạng thái chờ bên vận chuyển. Bạn sẽ được thông báo khi đơn được giao.`,
        color: '#2196F3',
      },
      3: {
        subject: 'Vật phẩm đang được giao đến bạn',
        title: 'Shipper đang chuyển đến người nhận',
        message: `Vật phẩm "<strong>${itemName}</strong>" đang được vận chuyển đến bạn. Trạng thái: ${statusName}.`,
        color: '#2196F3',
      },
      4: {
        subject: 'Đơn hàng đã hoàn thành',
        title: 'Hoàn thành',
        message: `Đơn hàng "<strong>${itemName}</strong>" đã hoàn thành. Cảm ơn bạn đã tham gia.`,
        color: '#4CAF50',
      },
    };

    const t = templates[notificationType];
    if (!t) return;

    const actionButton =
      t.actionUrl && t.actionLabel
        ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${t.actionUrl}" style="background-color: ${t.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">${t.actionLabel}</a>
        </div>
        `
        : '';

    const html = `
      <div style="${baseStyle}">
        <h2 style="color: ${t.color};">${t.title}</h2>
        <p>Xin chào ${userName},</p>
        <div style="${boxStyle}">
          ${t.message}
        </div>
        ${actionButton}
        <p>Trạng thái hiện tại: <strong>${statusName}</strong>.</p>
        <br>
        <p>Trân trọng,<br><strong>Hệ thống Tình nguyện</strong></p>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: t.subject,
      html,
    });
  }
}
