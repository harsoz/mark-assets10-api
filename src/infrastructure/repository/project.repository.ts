import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapProject } from './mappers';
import { Project } from 'src/infrastructure/database';
import type { ProjectModel } from 'src/domain/models';

@Injectable()
export class ProjectRepository extends BaseRepository<Project, ProjectModel> {
  constructor(@InjectRepository(Project) repo: Repository<Project>) {
    super(repo);
  }

  public toModel(entity: Project): ProjectModel {
    return mapProject(entity);
  }
}