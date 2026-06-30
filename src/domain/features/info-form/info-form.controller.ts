import {
  Controller,
  Post,
  Body,
  // UseGuards,
  // Req,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
// import { ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from 'src/shared/email/email.service';
import { InfoFormDTO } from './dtos/info-form.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { Response } from 'express';

@Controller('v1/info-forms')
export class InfoFormController {
  constructor(private readonly _emailService: EmailService) {}

  // not sure if this endpoints is intended to be protected by token
  @Post()
  @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async post(
    // @CurrentUser() user: any,
    @Body() request: InfoFormDTO,
    @Res() res: Response,
  ) {
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
