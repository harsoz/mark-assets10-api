import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapTrustedDevice } from './mappers';
import { TrustedDevice } from 'src/infrastructure/database';
import type { TrustedDeviceModel } from 'src/domain/models';

@Injectable()
export class TrustedDeviceRepository extends BaseRepository<TrustedDevice, TrustedDeviceModel> {
  constructor(@InjectRepository(TrustedDevice) repo: Repository<TrustedDevice>) {
    super(repo);
  }

  protected toModel(entity: TrustedDevice): TrustedDeviceModel {
    return mapTrustedDevice(entity);
  }
}