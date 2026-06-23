import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/infrastructure/database';
import { RoleRepository } from 'src/infrastructure/repository';
import { PermissionRepository } from 'src/infrastructure/repository/permission.repository';

@Injectable()
export class RoleManagerService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permRepo: PermissionRepository,
  ) {}

  // Equivalente a FindByIdAsync
  async findById(roleId: string) {
    return await this.roleRepo.findById(roleId);
  }

  // Equivalente a GetClaimsAsync
  async getPermissions(role: Role)  {
    const perms = await this.permRepo.findByRoleId(role.id);
    return perms.map(p => p.value);
  }

  // Equivalente a AddClaimAsync
  async addPermission(roleId: string, permissionValue: string): Promise<void> {
    await this.permRepo.create({ roleId, value: permissionValue });
  }

  // Equivalente a RemoveClaimAsync
  async removePermission(roleId: string, permissionValue: string): Promise<void> {
    await this.permRepo.deleteByRoleAndValue(roleId, permissionValue);
  }
}