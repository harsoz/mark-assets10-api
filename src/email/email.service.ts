import { Injectable } from '@nestjs/common';
import { EmailCollectionService } from './email-collection.service';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly _collection: EmailCollectionService,
    private readonly _template: EmailTemplateService,
  ) {}

  buildEmail(type: string, params: any) {
    const emailEngine = this._collection.getEmailEngine(type);
    const template = this._template.getTemplate(type);
    return emailEngine?.build(params, template);
  }

  // potentially we can make public only this one
  send() {
    console.log('sending email');
  }
}
