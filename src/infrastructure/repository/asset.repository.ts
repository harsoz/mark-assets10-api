import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapAsset, mapConsultingArchitecture } from './mappers';
import { Asset } from 'src/infrastructure/database';
import type { AssetModel, ConsultingArchitectureModel } from 'src/domain/models';

@Injectable()
export class AssetRepository extends BaseRepository<Asset, AssetModel> {
  constructor(@InjectRepository(Asset) repo: Repository<Asset>) {
    super(repo, 'projectId');
  }

  public toModel(entity: Asset): AssetModel {
    return mapAsset(entity);
  }
}