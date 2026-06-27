import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ajusta la ruta según tu estructura
import { EmailService } from 'src/shared/email/email.service';
import { InfoFormDTO } from './dtos/info-form.dto';

@Controller('v1/info-forms')
export class InfoFormController {
  constructor(private readonly _emailService: EmailService) {}

  @Post()
  //   @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async post(@Body() request: InfoFormDTO, @Req() req: any) {
    // En NestJS, el usuario suele estar en req.user después de pasar por el Guard
    const user = req.user;

    if (!user) {
      return null;
    }

    request.customerName = request.customerName ?? user.name;
    request.customerPhone = request.customerPhone ?? user.phoneNumber;
    request.customerEmail = request.customerEmail ?? user.email;

    const response = await this._emailService.sendToSystem('info-form', {
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phoneNumber,
    });

    return response;
  }
}
