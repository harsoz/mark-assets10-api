import { Injectable, OnModuleInit } from '@nestjs/common';
import { Permissions } from 'src/domain/types/permission.type';
import { UserPermissions } from 'src/domain/types/user-permission.type';
import { PermissionRepository } from 'src/infrastructure/repository/permission.repository';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(private readonly _permissionRepo: PermissionRepository) {}

  async findById(id: number) {
    return await this._permissionRepo.findById(id);
  }

  async addPermission(permissionValue: string): Promise<void> {
    await this._permissionRepo.create({ value: permissionValue });
  }

  async removePermission(id: number): Promise<void> {
    await this._permissionRepo.delete(id);
  }

  // fill permissions
  async onModuleInit() {
    await this.seedPermissions();
  }

  private async seedPermissions() {
    const regularPermissions = Object.values(Permissions);
    const userPermissions = Object.values(UserPermissions);
    const enumValues = [...regularPermissions, ...userPermissions];

    console.log('Seeding permissions...');
    const tasks = enumValues.map(async (value) => {
      const exists = await this._permissionRepo.findOne({ where: { value } });

      if (!exists) {
        await this._permissionRepo.create({ value });
        console.log(`Permission created: ${value}`);
      }
    });

    await Promise.all(tasks);
  }
}
