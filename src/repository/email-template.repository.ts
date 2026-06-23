import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapEmailTemplate } from './mappers';
import { EmailTemplate } from 'src/database';
import type { EmailTemplateModel } from 'src/models';

@Injectable()
export class EmailTemplateRepository extends BaseRepository<EmailTemplate, EmailTemplateModel> {
  constructor(@InjectRepository(EmailTemplate) repo: Repository<EmailTemplate>) {
    super(repo);
  }

  protected toModel(entity: EmailTemplate): EmailTemplateModel {
    return mapEmailTemplate(entity);
  }
}