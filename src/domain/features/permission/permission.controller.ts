import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/domain/types/permission.type';
import { UserPermissions } from 'src/domain/types/user-permission.type';

@Controller('v1/permissions')
export class PermissionController {
  // we probably need a service
  @Get()
  getPermissions(): string[] {
    return Object.values(Permissions);
  }

  @Get('user')
  getUserPermissions(): string[] {
    return Object.values(UserPermissions);
  }
}
