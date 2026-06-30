import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/domain/types/permission.type';
import { UserPermissions } from 'src/domain/types/user-permission.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  // we probably need to use the service
  @Get()
  @HttpCode(HttpStatus.OK)
  getPermissions(): string[] {
    return Object.values(Permissions);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  getUserPermissions(): string[] {
    return Object.values(UserPermissions);
  }
}
