import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }

  @Post('send-welcome')
  @HttpCode(HttpStatus.OK)
  async sendWelcomeEmail(
    @Body() body: { to: string; userName: string },
  ) {
    return this.emailService.sendWelcomeEmail(body.to, body.userName);
  }

  @Post('send-password-reset')
  @HttpCode(HttpStatus.OK)
  async sendPasswordResetEmail(
    @Body() body: { to: string; resetToken: string },
  ) {
    return this.emailService.sendPasswordResetEmail(body.to, body.resetToken);
  }

  @Post('send-donation-confirmation')
  @HttpCode(HttpStatus.OK)
  async sendDonationConfirmationEmail(
    @Body() body: { to: string; userName: string; donationDetails: any },
  ) {
    return this.emailService.sendDonationConfirmationEmail(
      body.to,
      body.userName,
      body.donationDetails,
    );
  }
}
