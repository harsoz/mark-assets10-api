import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { EmailService } from 'src/shared/email/email.service';
import { InfoFormDTO } from './dtos/info-form.dto';
import type { Response } from 'express';

@Controller('v1/info-forms')
export class InfoFormController {
  constructor(private readonly _emailService: EmailService) {}

  // not sure if this endpoints is intended to be protected by token
  @Post()
  @HttpCode(HttpStatus.OK)
  async post(@Body() request: InfoFormDTO, @Res() res: Response) {
    // fire and forget
    this._emailService.sendToSystem('info-form', {
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      message: request.message,
    });

    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
