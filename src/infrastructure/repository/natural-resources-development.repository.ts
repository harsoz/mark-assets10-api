import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapNaturalResourcesDevelopment } from './mappers';
import { NaturalResourcesDevelopment } from 'src/infrastructure/database';
import type { NaturalResourcesDevelopmentModel } from 'src/domain/models';

@Injectable()
export class NaturalResourcesDevelopmentRepository extends BaseRepository<NaturalResourcesDevelopment, NaturalResourcesDevelopmentModel> {
  constructor(@InjectRepository(NaturalResourcesDevelopment) repo: Repository<NaturalResourcesDevelopment>) {
    super(repo, 'projectId');
  }

  public toModel(entity: NaturalResourcesDevelopment): NaturalResourcesDevelopmentModel {
    return mapNaturalResourcesDevelopment(entity);
  }
}