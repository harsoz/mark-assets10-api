import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapCity } from './mappers';
import { City } from 'src/database';
import type { CityModel } from 'src/models';

@Injectable()
export class CityRepository extends BaseRepository<City, CityModel> {
  constructor(@InjectRepository(City) repo: Repository<City>) {
    super(repo);
  }

  protected toModel(entity: City): CityModel {
    return mapCity(entity);
  }
}