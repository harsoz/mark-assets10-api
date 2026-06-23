import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapAuthCode } from './mappers';
import { AuthCode } from 'src/database';
import type { AuthCodeModel } from 'src/models';

@Injectable()
export class AuthCodeRepository extends BaseRepository<AuthCode, AuthCodeModel> {
  constructor(@InjectRepository(AuthCode) repo: Repository<AuthCode>) {
    super(repo);
  }

  protected toModel(entity: AuthCode): AuthCodeModel {
    return mapAuthCode(entity);
  }
}