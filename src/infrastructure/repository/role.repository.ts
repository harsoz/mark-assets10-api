import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapRole } from './mappers';
import { Role } from 'src/infrastructure/database';
import type { RoleModel } from 'src/domain/models';

@Injectable()
export class RoleRepository extends BaseRepository<Role, RoleModel> {
  constructor(@InjectRepository(Role) repo: Repository<Role>) {
    super(repo);
  }

  protected toModel(entity: Role): RoleModel {
    return mapRole(entity);
  }
}