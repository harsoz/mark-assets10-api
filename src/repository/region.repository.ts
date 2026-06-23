import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapRegion } from './mappers';
import { Region } from 'src/database';
import type { RegionModel } from 'src/models';

@Injectable()
export class RegionRepository extends BaseRepository<Region, RegionModel> {
  constructor(@InjectRepository(Region) repo: Repository<Region>) {
    super(repo);
  }

  protected toModel(entity: Region): RegionModel {
    return mapRegion(entity);
  }
}