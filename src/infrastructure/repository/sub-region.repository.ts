import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapSubRegion } from './mappers';
import { SubRegion } from 'src/infrastructure/database';
import type { SubRegionModel } from 'src/domain/models';

@Injectable()
export class SubRegionRepository extends BaseRepository<SubRegion, SubRegionModel> {
  constructor(@InjectRepository(SubRegion) repo: Repository<SubRegion>) {
    super(repo);
  }

  protected toModel(entity: SubRegion): SubRegionModel {
    return mapSubRegion(entity);
  }
}