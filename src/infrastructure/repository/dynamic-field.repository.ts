import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapDynamicField } from './mappers';
import { DynamicField } from 'src/infrastructure/database';
import type { DynamicFieldModel } from 'src/domain/models';

@Injectable()
export class DynamicFieldRepository extends BaseRepository<DynamicField, DynamicFieldModel> {
  constructor(@InjectRepository(DynamicField) repo: Repository<DynamicField>) {
    super(repo);
  }

  public toModel(entity: DynamicField): DynamicFieldModel {
    return mapDynamicField(entity);
  }
}