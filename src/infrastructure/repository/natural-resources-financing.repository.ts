import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapNaturalResourcesFinancing } from './mappers';
import { NaturalResourcesFinancing } from 'src/infrastructure/database';
import type { NaturalResourcesFinancingModel } from 'src/domain/models';

@Injectable()
export class NaturalResourcesFinancingRepository extends BaseRepository<NaturalResourcesFinancing, NaturalResourcesFinancingModel> {
  constructor(@InjectRepository(NaturalResourcesFinancing) repo: Repository<NaturalResourcesFinancing>) {
    super(repo, 'projectId');
  }

  public toModel(entity: NaturalResourcesFinancing): NaturalResourcesFinancingModel {
    return mapNaturalResourcesFinancing(entity);
  }
}