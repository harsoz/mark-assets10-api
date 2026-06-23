import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapDataUserProfile } from './mappers';
import { DataUserProfile } from 'src/infrastructure/database';
import type { DataUserProfileModel } from 'src/domain/models';

@Injectable()
export class DataUserProfileRepository extends BaseRepository<DataUserProfile, DataUserProfileModel> {
  constructor(@InjectRepository(DataUserProfile) repo: Repository<DataUserProfile>) {
    super(repo);
  }

  protected toModel(entity: DataUserProfile): DataUserProfileModel {
    return mapDataUserProfile(entity);
  }
}