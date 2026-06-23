import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapRealState } from './mappers';
import { RealState } from 'src/infrastructure/database';
import type { RealStateModel } from 'src/domain/models';

@Injectable()
export class RealStateRepository extends BaseRepository<RealState, RealStateModel> {
  constructor(@InjectRepository(RealState) repo: Repository<RealState>) {
    super(repo, 'projectId');
  }

  protected toModel(entity: RealState): RealStateModel {
    return mapRealState(entity);
  }
}