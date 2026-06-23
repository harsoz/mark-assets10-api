import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapState } from './mappers';
import { State } from 'src/infrastructure/database';
import type { StateModel } from 'src/domain/models';

@Injectable()
export class StateRepository extends BaseRepository<State, StateModel> {
  constructor(@InjectRepository(State) repo: Repository<State>) {
    super(repo);
  }

  protected toModel(entity: State): StateModel {
    return mapState(entity);
  }
}