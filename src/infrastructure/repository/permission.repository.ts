import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { Permission } from "../database";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { PermissionModel } from "src/domain/models/permission.model";
import { mapPermission } from "./mappers";

@Injectable()
export class PermissionRepository extends BaseRepository<Permission, PermissionModel> {

  constructor(@InjectRepository(Permission) repo: Repository<Permission>) {
    super(repo, 'id');
  }

  async findByRoleId(id: number): Promise<Permission[]> {
    return await this.repository.find({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  public toModel(permission: Permission): PermissionModel {
      return mapPermission(permission);
  }
}