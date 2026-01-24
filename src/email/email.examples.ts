import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';

/**
 * Example: Integrate Email Service vào Auth Module
 * File: src/auth/auth.service.ts
 */

@Injectable()
export class AuthServiceExample {
  constructor(
    private emailService: EmailService,
    // ... other services
  ) {}

  // Example 1: Gửi welcome email khi đăng ký
  async register(userData: any) {
    // ... logic đăng ký user
    const newUser = await this.createUser(userData);

    // Gửi welcome email
    try {
      await this.emailService.sendWelcomeEmail(
        newUser.email,
        newUser.fullName
      );
    } catch (error) {
      // Log error nhưng không block việc đăng ký
      console.error('Failed to send welcome email:', error);
    }

    return newUser;
  }

  // Example 2: Gửi email reset password
  async forgotPassword(email: string) {
    // Tìm user
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Tạo reset token
    const resetToken = this.generateResetToken(user.id);

    // Gửi email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset email sent' };
  }

  // Example 3: Gửi email verify account
  async sendVerificationEmail(userId: string) {
    const user = await this.findUserById(userId);
    const verificationToken = this.generateVerificationToken(userId);

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hello ${user.fullName},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${process.env.FRONTEND_URL}/verify?token=${verificationToken}" 
             style="background: #4CAF50; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });
  }

  // Mock methods (thay bằng logic thật của bạn)
  private async createUser(userData: any) { return { email: '', fullName: '', id: '' }; }
  private async findUserByEmail(email: string) { return null; }
  private async findUserById(id: string) { return { email: '', fullName: '', id: '' }; }
  private generateResetToken(userId: string) { return ''; }
  private generateVerificationToken(userId: string) { return ''; }
}

/**
 * Example: Integrate Email Service vào Donation Module
 * File: src/donation-campaign/donation-campaign.service.ts
 */

@Injectable()
export class DonationServiceExample {
  constructor(
    private emailService: EmailService,
    // ... other services
  ) {}

  // Example: Gửi email confirmation khi donate
  async createDonation(donationData: any, userId: string) {
    // Tạo donation
    const donation = await this.saveDonation(donationData);
    const user = await this.getUserById(userId);
    const campaign = await this.getCampaignById(donationData.campaignId);

    // Gửi confirmation email
    await this.emailService.sendDonationConfirmationEmail(
      user.email,
      user.fullName,
      {
        campaignName: campaign.name,
        items: donationData.items.map(i => i.name).join(', '),
        date: new Date().toLocaleDateString('vi-VN'),
      }
    );

    return donation;
  }

  // Example: Gửi email nhắc nhở donation deadline
  async sendDonationReminder(campaignId: string) {
    const campaign = await this.getCampaignById(campaignId);
    const interestedUsers = await this.getInterestedUsers(campaignId);

    // Gửi email hàng loạt
    const promises = interestedUsers.map(user =>
      this.emailService.sendEmail({
        to: user.email,
        subject: `Reminder: ${campaign.name} is ending soon!`,
        html: `
          <div style="font-family: Arial; max-width: 600px;">
            <h2>⏰ Donation Deadline Reminder</h2>
            <p>Hello ${user.fullName},</p>
            <p>The campaign <strong>${campaign.name}</strong> will end in 3 days!</p>
            <p>Don't miss this opportunity to make a difference.</p>
            <a href="${process.env.FRONTEND_URL}/campaigns/${campaign.id}">
              View Campaign
            </a>
          </div>
        `,
      })
    );

    await Promise.all(promises);
  }

  // Example: Gửi email thank you sau khi campaign kết thúc
  async sendThankYouEmails(campaignId: string) {
    const campaign = await this.getCampaignById(campaignId);
    const donors = await this.getDonorsByCampaign(campaignId);

    const emailPromises = donors.map(donor =>
      this.emailService.sendEmail({
        to: donor.email,
        subject: `Thank you for supporting ${campaign.name}!`,
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">🙏 Thank You!</h1>
            <p>Dear ${donor.fullName},</p>
            <p>We want to express our heartfelt gratitude for your contribution to 
               <strong>${campaign.name}</strong>.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3>Campaign Results:</h3>
              <p>✅ Total donations: ${campaign.totalDonations}</p>
              <p>✅ Items collected: ${campaign.itemsCollected}</p>
              <p>✅ Families helped: ${campaign.familiesHelped}</p>
            </div>
            <p>Your kindness has made a real difference in our community!</p>
            <p>Best regards,<br><strong>Volunteer Team</strong></p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);
  }

  // Mock methods
  private async saveDonation(data: any) { return { id: '' }; }
  private async getUserById(id: string) { return { email: '', fullName: '' }; }
  private async getCampaignById(id: string) { return { id: '', name: '', totalDonations: 0, itemsCollected: '', familiesHelped: 0 }; }
  private async getInterestedUsers(campaignId: string) { return []; }
  private async getDonorsByCampaign(campaignId: string) { return []; }
}

/**
 * Example: Gửi email báo cáo định kỳ
 * File: src/report/report.service.ts
 */

@Injectable()
export class ReportServiceExample {
  constructor(
    private emailService: EmailService,
    // ... other services
  ) {}

  // Example: Gửi weekly report cho admins
  async sendWeeklyReport() {
    const admins = await this.getAdminUsers();
    const stats = await this.getWeeklyStats();

    const emailPromises = admins.map(admin =>
      this.emailService.sendEmail({
        to: admin.email,
        subject: `Weekly Report - Week of ${stats.weekStart}`,
        html: `
          <div style="font-family: Arial; max-width: 600px;">
            <h1>📊 Weekly Report</h1>
            <p>Hello ${admin.fullName},</p>
            <p>Here's your weekly summary:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Metric</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Count</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">New Users</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${stats.newUsers}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Donations</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${stats.donations}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Active Campaigns</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${stats.campaigns}</td>
              </tr>
            </table>
            
            <p>Keep up the great work!</p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);
  }

  // Mock methods
  private async getAdminUsers() { return []; }
  private async getWeeklyStats() { return { weekStart: '', newUsers: 0, donations: 0, campaigns: 0 }; }
}

/**
 * Example: Scheduled email với Cron Job
 * Cài đặt: npm install @nestjs/schedule
 * File: src/email/email-scheduler.service.ts
 * 
 * NOTE: Uncomment code below and install @nestjs/schedule to use:
 * npm install @nestjs/schedule
 */

// import { Cron, CronExpression } from '@nestjs/schedule';

// @Injectable()
// export class EmailSchedulerService {
//   constructor(
//     private emailService: EmailService,
//     // ... other services
//   ) {}

//   // Gửi email nhắc nhở mỗi ngày lúc 9:00 AM
//   @Cron(CronExpression.EVERY_DAY_AT_9AM)
//   async sendDailyReminders() {
//     console.log('Sending daily reminders...');
    
//     // Logic lấy users cần nhắc nhở
//     const usersToRemind = await this.getUsersNeedingReminder();
    
//     const promises = usersToRemind.map(user =>
//       this.emailService.sendEmail({
//         to: user.email,
//         subject: 'Daily Reminder - Volunteer Opportunities',
//         html: `<p>Hi ${user.fullName}, check out new volunteer opportunities!</p>`,
//       })
//     );
    
//     await Promise.all(promises);
//   }

//   // Gửi email báo cáo mỗi thứ 2 lúc 8:00 AM
//   @Cron(CronExpression.EVERY_MONDAY_AT_8AM)
//   async sendWeeklyReports() {
//     console.log('Sending weekly reports...');
//     // Logic gửi báo cáo
//   }

//   private async getUsersNeedingReminder() { return []; }
// }

/**
 * ⚠️ IMPORTANT: Để sử dụng EmailService trong module khác
 * 
 * 1. Import EmailModule vào module đó:
 * 
 * @Module({
 *   imports: [EmailModule],  // <- Import này
 *   controllers: [YourController],
 *   providers: [YourService],
 * })
 * export class YourModule {}
 * 
 * 2. Inject EmailService vào service/controller:
 * 
 * constructor(private emailService: EmailService) {}
 * 
 * 3. Sử dụng như các examples ở trên!
 */
