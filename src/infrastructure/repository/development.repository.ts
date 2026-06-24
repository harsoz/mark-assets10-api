import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapDevelopment } from './mappers';
import { Development } from 'src/infrastructure/database';
import type { AssetModel, DevelopmentModel } from 'src/domain/models';

@Injectable()
export class DevelopmentRepository extends BaseRepository<Development, DevelopmentModel> {
  constructor(@InjectRepository(Development) repo: Repository<Development>) {
    super(repo, 'projectId');
  }

  public toModel(entity: Development): AssetModel {
    return mapDevelopment(entity);
  }
}