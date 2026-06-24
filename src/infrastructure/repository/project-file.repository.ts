import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapProjectFile } from './mappers';
import { ProjectFile } from 'src/infrastructure/database';
import type { ProjectFileModel } from 'src/domain/models';

@Injectable()
export class ProjectFileRepository extends BaseRepository<ProjectFile, ProjectFileModel> {
  constructor(@InjectRepository(ProjectFile) repo: Repository<ProjectFile>) {
    super(repo);
  }

  public toModel(entity: ProjectFile): ProjectFileModel {
    return mapProjectFile(entity);
  }
}