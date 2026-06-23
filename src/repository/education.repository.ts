import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapEducation } from './mappers';
import { Education } from 'src/database';
import type { EducationModel } from 'src/models';

@Injectable()
export class EducationRepository extends BaseRepository<Education, EducationModel> {
  constructor(@InjectRepository(Education) repo: Repository<Education>) {
    super(repo);
  }

  protected toModel(entity: Education): EducationModel {
    return mapEducation(entity);
  }
}