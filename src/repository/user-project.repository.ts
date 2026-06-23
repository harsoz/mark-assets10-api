import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapUserProject } from './mappers';
import { UserProject } from 'src/database';
import type { UserProjectModel } from 'src/models';

@Injectable()
export class UserProjectRepository extends BaseRepository<UserProject, UserProjectModel> {
  constructor(@InjectRepository(UserProject) repo: Repository<UserProject>) {
    super(repo);
  }

  protected toModel(entity: UserProject): UserProjectModel {
    return mapUserProject(entity);
  }
}