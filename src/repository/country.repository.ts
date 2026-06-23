import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapCountry } from './mappers';
import { Country } from 'src/database';
import type { CountryModel } from 'src/models';

@Injectable()
export class CountryRepository extends BaseRepository<Country, CountryModel> {
  constructor(@InjectRepository(Country) repo: Repository<Country>) {
    super(repo);
  }

  protected toModel(entity: Country): CountryModel {
    return mapCountry(entity);
  }
}