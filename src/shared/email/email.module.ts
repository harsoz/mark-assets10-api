import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailCollectionService } from './email-collection.service';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'SMPT_HOST',
        auth: { user: '...', pass: '...' },
      },
    }),
  ],
  providers: [EmailCollectionService, EmailTemplateService, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
