import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailTemplateService {
  getTemplate(name: string) {
    const html = fs.readFileSync(
      path.join(__dirname, `templates/${name}.html`),
      'utf8',
    );
    return html;
  }
}
