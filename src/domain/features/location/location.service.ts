import { Injectable } from '@nestjs/common';
import {
  CountryRepository,
  StateRepository,
  CityRepository,
} from '../../../infrastructure/repository';
import { GetRestrictedUserDTO } from './dtos/get-restricted-user.dto';

@Injectable()
export class LocationService {
  constructor(
    private readonly _countryRepo: CountryRepository,
    private readonly _stateRepo: StateRepository,
    private readonly _cityRepo: CityRepository,
  ) {}

  async getAllCountries() {
    const data = await this._countryRepo.findAll();
    const parsedData = data.map((c) => this._countryRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }

  async getStatesByCountryId(countryId: number) {
    const data = await this._stateRepo.findAll({ where: { countryId } });
    const parsedData = data.map((c) => this._stateRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }

  async getCitiesByStateId(stateId: number) {
    const data = await this._cityRepo.findAll({ where: { stateId } });
    const parsedData = data.map((c) => this._cityRepo.toModel(c));
    return { totalCount: data.length, data: parsedData };
  }

  /**
   * @deprecated
   * This method is potentially no longer used
   */
  async getAllCities(request: GetRestrictedUserDTO) {
    const query = this._cityRepo.createQueryBuilder('city');

    if (request.search) {
      query.andWhere('city.name LIKE :search', {
        search: `%${request.search}%`,
      });
    }

    if (request.shouldSearchByDate()) {
      query.andWhere('city.updatedAt > :from AND city.updatedAt < :to', {
        from: request.fromDate,
        to: request.toDate,
      });
    }

    const sort = request.sort || 'createdAt';
    const order = (request.order || 'ASC').toUpperCase() as 'ASC' | 'DESC';
    query.orderBy(`city.${sort}`, order);

    if (request.isPaginated()) {
      query
        .skip(((request.page || 0) - 1) * (request.pageSize || 0))
        .take(request.pageSize);
    }

    const [data, totalCount] = await query.getManyAndCount();
    const parsedData = data.map((location) => this._cityRepo.toModel(location));
    return { totalCount, data: parsedData };
  }
}
