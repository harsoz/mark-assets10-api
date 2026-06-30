import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { GetRoleDTO } from './dtos/get-role.dto';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/roles/')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(@Query() request: GetRoleDTO) {

    if (request.isPaginated()) {
      return this._roleService.get(request);
    }

    return this._roleService.getAll();
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  getRole(@Param('roleId') roleId: string) {
    return this._roleService.getRole(roleId);
  }

  @Get('management-roles/all')
  @HttpCode(HttpStatus.OK)
  getManagementRoles() {
    return this._roleService.getManagementRoles();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRole(@Body() request: CreateRoleDTO) {
    const createdRole = this._roleService.create(request);
    return createdRole;
  }

  @Put(':roleId')
  @HttpCode(HttpStatus.OK)
  updateRole(@Body() request: UpdateRoleDTO, @Param('roleId') roleId: string) {
    const updatedRole = this._roleService.update(request, roleId);
    return updatedRole;
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.OK)
  deleteRole(@Param('roleId') roleId: string) {
    const deletedRole = this._roleService.delete(roleId);
    return deletedRole;
  }
}
