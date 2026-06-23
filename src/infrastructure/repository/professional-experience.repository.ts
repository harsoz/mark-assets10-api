import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapProfessionalExperience } from './mappers';
import { ProfessionalExperience } from 'src/infrastructure/database';
import type { ProfessionalExperienceModel } from 'src/domain/models';

@Injectable()
export class ProfessionalExperienceRepository extends BaseRepository<ProfessionalExperience, ProfessionalExperienceModel> {
  constructor(@InjectRepository(ProfessionalExperience) repo: Repository<ProfessionalExperience>) {
    super(repo);
  }

  protected toModel(entity: ProfessionalExperience): ProfessionalExperienceModel {
    return mapProfessionalExperience(entity);
  }
}