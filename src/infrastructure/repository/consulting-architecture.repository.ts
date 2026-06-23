import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapConsultingArchitecture } from './mappers';
import { ConsultingArchitecture } from 'src/infrastructure/database';
import type { ConsultingArchitectureModel } from 'src/domain/models';

@Injectable()
export class ConsultingArchitectureRepository extends BaseRepository<ConsultingArchitecture, ConsultingArchitectureModel> {
  constructor(@InjectRepository(ConsultingArchitecture) repo: Repository<ConsultingArchitecture>) {
    super(repo, 'projectId');
  }

  protected toModel(entity: ConsultingArchitecture): ConsultingArchitectureModel {
    return mapConsultingArchitecture(entity);
  }
}