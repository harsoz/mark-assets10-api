import { Module } from '@nestjs/common';
import { InfoFormController } from './info-form.controller';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [InfoFormController],
  providers: [],
})
export class InfoFormModule {}
