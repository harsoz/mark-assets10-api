import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapInfrastructure } from './mappers';
import { Infrastructure } from 'src/infrastructure/database';
import type { InfrastructureModel } from 'src/domain/models';

@Injectable()
export class InfrastructureRepository extends BaseRepository<Infrastructure, InfrastructureModel> {
  constructor(@InjectRepository(Infrastructure) repo: Repository<Infrastructure>) {
    super(repo, 'projectId');
  }

  protected toModel(entity: Infrastructure): InfrastructureModel {
    return mapInfrastructure(entity);
  }
}