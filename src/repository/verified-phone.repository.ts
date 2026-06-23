import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapVerifiedPhone } from './mappers';
import { VerifiedPhone } from 'src/database';
import type { VerifiedPhoneModel } from 'src/models';

@Injectable()
export class VerifiedPhoneRepository extends BaseRepository<VerifiedPhone, VerifiedPhoneModel> {
  constructor(@InjectRepository(VerifiedPhone) repo: Repository<VerifiedPhone>) {
    super(repo);
  }

  protected toModel(entity: VerifiedPhone): VerifiedPhoneModel {
    return mapVerifiedPhone(entity);
  }
}