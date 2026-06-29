import { Injectable, Logger } from '@nestjs/common';
import { EmailCollectionService } from './email-collection.service';
import { EmailTemplateService } from './email-template.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UserModel } from 'src/domain/models';

// maybe we are missing using import { MailerModule } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly senderEmail: string;
  private readonly receiverEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly _collection: EmailCollectionService,
    private readonly _template: EmailTemplateService,
  ) {
    this.senderEmail = this.configService.get<string>('SMTP_SENDER') ?? '';
    this.receiverEmail = this.configService.get<string>('SMTP_SENDER') ?? '';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<number>('SMTP_PORT')),
      secure: this.configService.get<string>('SMTP_ENABLE_SSL') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USERNAME'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async send(type: string, params: any, recipient: string) {
    const { html, subject } = this.buildEmail(type, params)!;
    await this.sendEmail(html, subject, recipient);
  }

  // system sends an email to itself
  async sendToSystem(type: string, params: any) {
    const { html, subject } = this.buildEmail(type, params)!;
    await this.sendEmail(html, subject, this.receiverEmail);
  }

  private buildEmail(type: string, params: any) {
    const emailEngine = this._collection.getEmailEngine(type);
    const template = this._template.getTemplate(type);
    return emailEngine?.build(params, template);
  }

  private async sendEmail(
    body: string,
    subject: string,
    recipient: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.senderEmail,
        to: recipient,
        subject: subject,
        html: body,
      });
      this.logger.debug(`Email sent to ${recipient}`);
    } catch (error) {
      this.logger.error(`Error while sending email to ${recipient}`, error);
    }
  }

  // part of EmailSender originally - move this to an strategy
  async sendConfirmationLinkAsync(
    user: UserModel,
    email: string,
    confirmationLink: string,
  ): Promise<void> {
    const body = `Hola ${user.name}, su codigo de confirmacion es ${confirmationLink}`;
    const subject = 'Confirmacion Assets10';
    await this.sendEmail(body, subject, email);
  }

  // potentially need to move to an strategy to clarify code or link, because strategy reset-password already cover this
  async sendPasswordResetLinkAsync(
    user: UserModel,
    email: string,
    resetLink: string,
  ): Promise<void> {
    const emailObj = { template: '', subject: '' }; // ResetPasswordEmail.buildTemplate(user, email, resetLink);
    await this.sendEmail(emailObj.template, emailObj.subject, email);
  }

  async sendPasswordResetCodeAsync(
    user: UserModel,
    email: string,
    resetCode: string,
  ): Promise<void> {
    const emailObj = { template: '', subject: '' }; // ResetPasswordEmail.buildTemplate(user, email, resetCode);
    await this.sendEmail(emailObj.template, emailObj.subject, email);
  }

  // part of EmailService originally (covered by strategies)
  /**
   * public async Task<bool> AccountCreated(User user)
        {
            if (!string.IsNullOrEmpty(user.Email))
            {
                var template = await _context.EmailTemplates.Where(x => x.Name == AccountCreatedEmail.Name).FirstOrDefaultAsync();

                var emailDef = AccountCreatedEmail.BuildTemplate(user, user.Email, template);

                return SendEmail(user.Email, emailDef.Subject, emailDef.Template);
            }
            return false;
        }

        public async Task<bool> SubmitInfoForm(InfoFormDTO info)
        {
            if (!string.IsNullOrEmpty(ReceiverEmail))
            {
                var template = await _context.EmailTemplates.Where(x => x.Name == InfoFormEmail.Name).FirstOrDefaultAsync();
                var emailDef = InfoFormEmail.BuildTemplate(info, template);

                return SendEmail(ReceiverEmail, emailDef.Subject, emailDef.Template);
            }
            return false;
        }

        public async Task<bool> SendVerificationCode(User user, string code)
        {
            if (!string.IsNullOrEmpty(user.Email))
            {
                var template = await _context.EmailTemplates.Where(x => x.Name == TwoFactorAuthenticationEmail.Name).FirstOrDefaultAsync();
                var emailDef = TwoFactorAuthenticationEmail.BuildTemplate(user.Email, code, template);

                return SendEmail(user.Email, emailDef.Subject, emailDef.Template);
            }
            return false;
        }
   * 
   */
}
