import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapUserDynamicField } from './mappers';
import { UserDynamicField } from 'src/database';
import type { UserDynamicFieldModel } from 'src/models';

@Injectable()
export class UserDynamicFieldRepository extends BaseRepository<UserDynamicField, UserDynamicFieldModel> {
  constructor(@InjectRepository(UserDynamicField) repo: Repository<UserDynamicField>) {
    super(repo);
  }

  protected toModel(entity: UserDynamicField): UserDynamicFieldModel {
    return mapUserDynamicField(entity);
  }
}