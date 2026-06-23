import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapFinancing } from './mappers';
import { Financing } from 'src/database';
import type { FinancingModel } from 'src/models';

@Injectable()
export class FinancingRepository extends BaseRepository<Financing, FinancingModel> {
  constructor(@InjectRepository(Financing) repo: Repository<Financing>) {
    super(repo, 'projectId');
  }

  protected toModel(entity: Financing): FinancingModel {
    return mapFinancing(entity);
  }
}