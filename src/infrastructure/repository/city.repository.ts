import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapCity } from './mappers';
import { City } from 'src/infrastructure/database';
import type { CityModel } from 'src/domain/models';

@Injectable()
export class CityRepository extends BaseRepository<City, CityModel> {
  constructor(@InjectRepository(City) repo: Repository<City>) {
    super(repo);
  }

  public toModel(entity: City): CityModel {
    return mapCity(entity);
  }
}