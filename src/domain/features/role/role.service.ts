import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleRepository, UnitOfWork } from 'src/infrastructure/repository';
import { Permission, Role } from 'src/infrastructure/database';
import { GetRoleDTO } from './dtos/get-role.dto';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  private readonly superAdminId: string;

  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly config: ConfigService,
    private readonly unitOfWork: UnitOfWork,
  ) {
    this.superAdminId = this.config.get<string>('SUPER_ADMIN_ID') || '';
  }

  async getAll() {
    const query = this.roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.permissions', 'permission')
      .select(['role', 'permission.value']);

    const [data, totalCount] = await query.getManyAndCount();

    const mappedRoles = data.map((role) => {
      return {
        ...this.roleRepo.toModel(role),
        permissions: role.permissions
          ? role.permissions.map((p) => p.value)
          : [],
      };
    });

    return { totalCount, data: mappedRoles };
  }

  async get(request: GetRoleDTO) {
    const query = this.roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.permissions', 'permission')
      .select(['role', 'permission.value']);

    if (request.search) {
      query.andWhere('role.name LIKE :search', {
        search: `%${request.search}%`,
      });
    }

    const [data, totalCount] = await query
      .skip(((request.page || 0) - 1) * (request.pageSize || 0))
      .take(request.pageSize)
      .getManyAndCount();

    const mappedRoles = data.map((role) => {
      return {
        ...this.roleRepo.toModel(role),
        permissions: role.permissions
          ? role.permissions.map((p) => p.value)
          : [],
      };
    });

    return { totalCount, data: mappedRoles };
  }

  async getRole(roleId: string) {
    const query = this.roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.permissions', 'permission')
      .select(['role', 'permission.value'])
      .andWhere('role.id = :roleId', {
        roleId,
      });

    const role = await query.getOne();
    if (!role) throw new NotFoundException('Role does not exist');

    return {
      ...this.roleRepo.toModel(role),
      permissions: role.permissions ? role.permissions.map((p) => p.value) : [],
    };
  }

  async getManagementRoles() {
    const query = this.roleRepo
      .createQueryBuilder('role')
      .leftJoin('role.permissions', 'permission')
      .select(['role', 'permission.value'])
      .andWhere('role.name IN (:...roleNames)', {
        roleNames: ['Admin', 'Manager'],
      });

    // potentially we can add pagination if performance is required
    const [data, totalCount] = await query.getManyAndCount();

    const mappedRoles = data.map((role) => {
      return {
        ...this.roleRepo.toModel(role),
        permissions: role.permissions
          ? role.permissions.map((p) => p.value)
          : [],
      };
    });

    return { totalCount, data: mappedRoles };
  }

  async create(request: CreateRoleDTO) {
    return await this.unitOfWork.runInTransaction(async (manager) => {
      const existing = await manager.findOne(Role, {
        where: { name: request.name },
      });
      if (existing) throw new ConflictException('Role already exists');

      const roleEntity = manager.create(Role, {
        name: request.name,
        isAdmin: request.isAdmin,
      });
      const role = await manager.save(roleEntity);

      if (request.permissions && request.permissions.length > 0) {
        const permissionsEntities = request.permissions.map((permValue) =>
          manager.create(Permission, { value: permValue }),
        );

        const savedPermissions = await manager.save(permissionsEntities);
        role.permissions = savedPermissions;
        await manager.save(role);
      }

      return this.roleRepo.toModel(role);
    });
  }

  async update(request: UpdateRoleDTO, roleId: string) {
    return await this.unitOfWork.runInTransaction(async (manager) => {
      const role = await manager.findOne(Role, {
        where: { id: roleId },
        relations: {
          permissions: true,
        },
      });
      if (!role) throw new NotFoundException('Role does not exist');

      if (request.name !== role.name) {
        const duplicate = await manager.findOne(Role, {
          where: { name: request.name },
        });
        if (duplicate) throw new ConflictException('Role name already exists');

        role.name = request.name;
      }

      if (request.permissions) {
        if (request.permissions.length > 0) {
          const existingPermissions = await manager.find(Permission, {
            where: { value: In(request.permissions) },
          });

          const existingValues = existingPermissions.map((p) => p.value);

          const newValues = request.permissions.filter(
            (p) => !existingValues.includes(p),
          );

          let newlyCreatedPermissions: Permission[] = [];

          if (newValues.length > 0) {
            const entitiesToCreate = newValues.map((val) =>
              manager.create(Permission, { value: val }),
            );
            newlyCreatedPermissions = await manager.save(entitiesToCreate);
          }

          role.permissions = [
            ...existingPermissions,
            ...newlyCreatedPermissions,
          ];
        } else {
          // check this if it's required to send all permissions when updating the role
          // to do not delete them
          role.permissions = [];
        }
      }

      await manager.save(role);

      return true;
    });
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
