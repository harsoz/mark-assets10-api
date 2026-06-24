import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapFinancing } from './mappers';
import { Financing } from 'src/infrastructure/database';
import type { FinancingModel } from 'src/domain/models';

@Injectable()
export class FinancingRepository extends BaseRepository<Financing, FinancingModel> {
  constructor(@InjectRepository(Financing) repo: Repository<Financing>) {
    super(repo, 'projectId');
  }

  public toModel(entity: Financing): FinancingModel {
    return mapFinancing(entity);
  }
}