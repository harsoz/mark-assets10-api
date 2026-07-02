import { Injectable } from '@nestjs/common';
import {
  CountryRepository,
  StateRepository,
  CityRepository,
} from '../../../infrastructure/repository';

@Injectable()
export class LocationService {
  constructor(
    private readonly _countryRepo: CountryRepository,
    private readonly _stateRepo: StateRepository,
    private readonly _cityRepo: CityRepository,
  ) {}

  /**
   * @description data only
   * @returns Get all countries
   */
  async getAllCountries() {
    const data = await this._countryRepo
      .createQueryBuilder('country')
      .select('country.id', 'id')
      .addSelect('country.name', 'name')
      .addSelect('country.flag', 'flag')
      .addSelect('country.currency', 'currency')
      .addSelect('country.phoneCode', 'phoneCode')
      .addSelect('country.iso3', 'iso3')
      .addSelect('country.iso2', 'iso2')
      .addSelect('country.currencySymbol', 'currencySymbol')
      .addSelect('country.currencyName', 'currencyName')
      .addSelect('country.capital', 'capital')
      .addSelect('country.tld', 'tld')
      .addSelect('country.native', 'native')
      .addSelect('country.region', 'region')
      .addSelect('country.subRegion', 'subRegion')
      .addSelect('country.wikiDataId', 'wikiDataId')
      .addSelect('country.timezones', 'timezones')
      .addSelect('country.translations', 'translations')
      .addSelect('country.nationality', 'nationality')
      .addSelect('country.emoji', 'emoji')
      .addSelect('country.emojiU', 'emojiU')
      .addSelect('country.regionId', 'regionId')
      .addSelect('country.subRegionId', 'subRegionId')
      .getRawMany();

    const parsedData = data.map((c) => this._countryRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }

  /**
   * @description data only
   * @returns Get all states by country id
   */
  async getStatesByCountryId(countryId: number) {
    const data = await this._stateRepo
      .createQueryBuilder('state')
      .select('state.id', 'id')
      .addSelect('state.name', 'name')
      .addSelect('state.countryCode', 'countryCode')
      .addSelect('state.iso2', 'iso2')
      .addSelect('state.flag', 'flag')
      .addSelect('state.fipsCode', 'fipsCode')
      .addSelect('state.type', 'type')
      .addSelect('state.wikiDataId', 'wikiDataId')
      .addSelect('state.countryId', 'countryId')
      .addSelect('state.latitude', 'latitude')
      .addSelect('state.longitude', 'longitude')
      .where('state.countryId = :countryId', { countryId })
      .getRawMany();
    const parsedData = data.map((c) => this._stateRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }

  /**
   * @description data only
   * @returns Get all cities by state id
   */
  async getCitiesByStateId(stateId: number) {
    const data = await this._cityRepo.createQueryBuilder('city')
      .select('city.id', 'id')
      .addSelect('city.name', 'name')
      .addSelect('city.stateCode', 'stateCode')
      .addSelect('city.countryCode', 'countryCode')
      .addSelect('city.latitude', 'latitude')
      .addSelect('city.longitude', 'longitude')
      .addSelect('city.flag', 'flag')
      .addSelect('city.wikiDataId', 'wikiDataId')
      .addSelect('city.countryId', 'countryId')
      .addSelect('city.stateId', 'stateId')
      .where('city.stateId = :stateId', { stateId })
      .getRawMany();

    const parsedData = data.map((c) => this._cityRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }
}
