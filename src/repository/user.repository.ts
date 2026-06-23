import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapUser } from './mappers';
import { User } from 'src/database';
import type { UserModel } from 'src/models';

@Injectable()
export class UserRepository extends BaseRepository<User, UserModel> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo);
  }

  protected toModel(entity: User): UserModel {
    return mapUser(entity);
  }
}