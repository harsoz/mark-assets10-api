import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapEnergyAsset } from './mappers';
import { EnergyAsset } from 'src/infrastructure/database';
import type { EnergyAssetModel } from 'src/domain/models';

@Injectable()
export class EnergyAssetRepository extends BaseRepository<EnergyAsset, EnergyAssetModel> {
  constructor(@InjectRepository(EnergyAsset) repo: Repository<EnergyAsset>) {
    super(repo, 'projectId');
  }

  protected toModel(entity: EnergyAsset): EnergyAssetModel {
    return mapEnergyAsset(entity);
  }
}