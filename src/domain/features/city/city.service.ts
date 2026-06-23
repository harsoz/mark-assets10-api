import { Injectable } from '@nestjs/common';
import { GetRestrictedUserDTO } from './dtos/get-restricted-user.dto'; // Tu DTO de entrada
import { CityRepository } from 'src/infrastructure/repository';

@Injectable()
export class CityService {
  constructor(private readonly _repository: CityRepository) {}

  async get(request: GetRestrictedUserDTO) {
    const query = this._repository.createQueryBuilder('city');

    if (request.search) {
      query.andWhere('city.name LIKE :search', { search: `%${request.search}%` });
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

    const pageSize = request.pageSize || 10;
    const page = request.page || 1;
    query.skip(pageSize * (page - 1)).take(pageSize);

    const [data, totalCount] = await query.getManyAndCount();

    return { totalCount, data };
  }
}