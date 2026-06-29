import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import type { Request, Response } from 'express';
import { RefreshDTO } from './dtos/refresh.dto';
import { VerifyMfaDTO } from './dtos/verify-mfa.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/infrastructure/database';
import { VerifyPhoneDTO } from './dtos/verify-phone.dto';
import { SendPhoneVerificationDTO } from './dtos/send-phone-verification-code.dto';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() payload: RegisterDTO) {
    return this._authService.signUp(payload);
  }

  @Post('sign-in')
  async signIn(@Body() payload: LoginDTO, @Res() res: Response) {
    const result = await this._authService.signIn(payload);

    // check if necessary
    if (result.requiresMFA) {
      return res.status(HttpStatus.ACCEPTED).json(result);
    }

    return res.status(HttpStatus.OK).json(result);
  }

  @Post('sign-in/admin-panel')
  async signInAdminPanel(@Body() payload: LoginDTO, @Res() res: Response) {
    const result = await this._authService.signIn(payload, true);

    // check if necessary
    if (result.requiresMFA) {
      return res.status(HttpStatus.ACCEPTED).json(result);
    }

    return res.status(HttpStatus.OK).json(result);
  }

  @Post('sign-in/admin')
  async signInAdmin(@Body() payload: LoginDTO, @Res() res: Response) {
    // check if necessary
    const result = await this._authService.signInAdmin(payload);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() payload: RefreshDTO) {
    return await this._authService.refresh(payload);
  }

  @ApiBearerAuth()
  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@CurrentUser() user: any, @Res() res: Response) {
    const jwtPayload = user as { id: string };

    if (!jwtPayload || !jwtPayload.id) {
      return res.status(HttpStatus.OK).json(null);
    }

    const mappedUser = await this._authService.verifyToken(jwtPayload.id);

    if (!mappedUser) {
      return res.status(HttpStatus.OK).json(null);
    }

    return res.status(HttpStatus.OK).json(mappedUser);
  }

  @Post('verify-mfa')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDTO) {
    return await this._authService.verifyMfa(verifyMfaDto);
  }

  @ApiBearerAuth()
  @Post('verify-phone')
  @UseGuards(JwtAuthGuard)
  async verifyPhone(
    @Body() request: VerifyPhoneDTO,
    @CurrentUser() user: User, // need to check the model for user
  ) {
    return await this._authService.verifyPhone(request, user.id);
  }

  @ApiBearerAuth()
  @Post('send-phone-verification-code')
  @UseGuards(JwtAuthGuard)
  async sendPhoneVerificationCode(
    @Body() request: SendPhoneVerificationDTO,
    @CurrentUser() user: User,
  ) {
    return await this._authService.sendPhoneVerificationCode(request, user.id);
  }

  @ApiBearerAuth()
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() dto: ChangePasswordDTO,
    @CurrentUser() user: User,
  ) {
    return await this._authService.changePassword(dto, user.id);
  }
}
