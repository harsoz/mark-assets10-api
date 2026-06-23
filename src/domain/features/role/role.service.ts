import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from 'src/infrastructure/repository';
import { RoleManagerService } from './role-manager.service';
import { Role } from 'src/infrastructure/database';
import { GetRoleDTO } from './dtos/get-role.dto';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  private readonly superAdminId: string;

  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly roleManager: RoleManagerService,
    private readonly config: ConfigService,
  ) {
    this.superAdminId = this.config.get<string>('SUPER_ADMIN_ID') || '';
  }

  async getAll() {
    const roles = await this.roleRepo.findAll();
    return { totalCount: roles.length, data: roles };
  }

  async getRole(roleId: string) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');
    
    const permissions = await this.roleManager.getPermissions(role as Role);
    
    return {
      ...role,
      permissions
    };
  }

  async getManagementRoles() {
    const allRoles = await this.roleRepo.findAll();
    const managementRoles = allRoles.filter(r => r.name && ['Admin', 'Manager'].includes(r.name)); 
    return { totalCount: managementRoles.length, data: managementRoles };
  }

  async get(request: GetRoleDTO) {
    const query = this.roleRepo.createQueryBuilder('role');
    
    if (request.search) {
      query.andWhere('role.name LIKE :search', { search: `%${request.search}%` });
    }

    const [data, totalCount] = await query
      .skip((request.page || 0 - 1) * (request.pageSize || 0))
      .take(request.pageSize)
      .getManyAndCount();

    const mappedRoles = await Promise.all(data.map(async (role) => {
      const permissions = await this.roleManager.getPermissions(role);
      return { ...role, permissions };
    }));

    return { totalCount, data: mappedRoles };
  }

  async create(request: CreateRoleDTO) {
    const existing = await this.roleRepo.findOne({ where: { name: request.name } });
    if (existing) throw new ConflictException('Role already exists');

    const role = await this.roleRepo.create({ name: request.name, isAdmin: request.isAdmin });
    
    for (const permission of request.permissions ||[]) {
      await this.roleManager.addPermission(role.id, permission);
    }
    return role;
  }

  async update(request: UpdateRoleDTO, roleId: string) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('Role does not exist');

    const duplicate = await this.roleRepo.findOne({ where: { name: request.name } });
    if (duplicate && duplicate.id !== roleId) throw new ConflictException('Role name already exists');

    role.name = request.name;
    await this.roleRepo.create(role);

    const currentPermissions = await this.roleManager.getPermissions(role);
    const toRemove = currentPermissions.filter(p => !request.permissions.includes(p));
    const toAdd = request.permissions.filter(p => !currentPermissions.includes(p));

    for (const p of toRemove) await this.roleManager.removePermission(roleId, p);
    for (const p of toAdd) await this.roleManager.addPermission(roleId, p);

    return true;
  }

  async delete(roleId: string) {
    if (this.superAdminId && roleId !== this.superAdminId) {
      throw new ForbiddenException('Role is undeletable');
    }

    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('Role does not exist');

    await this.roleRepo.delete(roleId);

    return true;
  }
}