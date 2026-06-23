import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapDynamicField } from './mappers';
import { DynamicField } from 'src/database';
import type { DynamicFieldModel } from 'src/models';

@Injectable()
export class DynamicFieldRepository extends BaseRepository<DynamicField, DynamicFieldModel> {
  constructor(@InjectRepository(DynamicField) repo: Repository<DynamicField>) {
    super(repo);
  }

  protected toModel(entity: DynamicField): DynamicFieldModel {
    return mapDynamicField(entity);
  }
}