import { Injectable } from '@nestjs/common';
import { GetProjectDTO } from './dtos/get-project.dto';
import { ProjectType } from 'src/domain/types/project.type';
import { DataSource } from 'typeorm';
import { ProjectReadModel } from 'src/domain/models';

@Injectable()
export class ProjectDetailsService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * @kind readonly data - crud operations not available for entities
   * @returns all projects by type not paginated
   */
  async getAllProjects(projectType: ProjectType) {
    const rawResults = (await this.dataSource.query(
      'EXEC sp_getProjectsFilteredByType @type = @0',
      [projectType],
    )) as ProjectReadModel[];

    return rawResults.map((row) => ({
      ...row,
      details:
        typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
    }));
  }

  /**
   * @kind readonly data - crud operations not available for entities
   * @description we should use pagination for all
   * @returns all projects by type paginated conditionally
   */
  async getAll(request: GetProjectDTO) {
    const { sql, params } = this.buildStoredProcedureParams(request);

    const rawResults = (await this.dataSource.query(
      `EXEC dbo.sp_getProjectsFilteredByType ${sql}`,
      params,
    )) as ProjectReadModel[];

    const data = rawResults.map((row) => ({
      ...row,
      details:
        typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
    }));

    const totalCount = data.length;

    return { totalCount, data };
  }

  /**
   * @kind readonly data - crud operations not available for entities
   * @returns all projects by type and userid paginated conditionally
   */
  async getAllByUserId(request: GetProjectDTO, userId: string) {
    // it seems like only valid projects are retrieved per user
    request.isActive = true;

    const { sql, params } = this.buildStoredProcedureParams(request, userId);

    const rawResults = (await this.dataSource.query(
      `EXEC dbo.sp_getProjectsFilteredByType ${sql}`,
      [...params],
    )) as ProjectReadModel[];
    
    const data = rawResults.map((row) => ({
      ...row,
      details:
        typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
    }));

    const totalCount = data.length;

    return { totalCount, data };
  }

  // probably moved this to collectionService
  private buildStoredProcedureParams(request: GetProjectDTO, userId?: string) {
    const params: any[] = [];
    const conditions: string[] = [];

    // we might use the GetProjectDTO keys
    const mappings = [
      // general filters
      { key: 'projectType', param: '@projectType' },
      { key: 'page', param: '@page' },
      { key: 'pageSize', param: '@pageSize' },
      { key: 'isActive', param: '@isActive' },
      { key: 'countryId', param: '@countryId' },
      { key: 'stateId', param: '@stateId' },
      { key: 'cityId', param: '@cityId' },
      { key: 'status', param: '@status' },
      { key: 'landArea', param: '@landArea' },
      { key: 'minPrice', param: '@minPrice' },
      { key: 'maxPrice', param: '@maxPrice' },

      // particular filters
      { key: 'type', param: '@type' },
      { key: 'minLandArea', param: '@minLandArea' },
      { key: 'maxLandArea', param: '@maxLandArea' },
      { key: 'minSizeInAcres', param: '@minSizeInAcres' },
      { key: 'maxSizeInAcres', param: '@maxSizeInAcres' },
      { key: 'relationShipWithOwner', param: '@relationShipWithOwner' },
      { key: 'ownersIntention', param: '@ownersIntention' },
      { key: 'suggestedUse', param: '@suggestedUse' },
      { key: 'landAvailable', param: '@landAvailable' },
      { key: 'segment', param: '@segment' },
      { key: 'storageIncluded', param: '@storageIncluded' },
      { key: 'serviceType', param: '@serviceType' },
      { key: 'ppaContract', param: '@ppaContract' },
    ];

    // 1. Manejar paginación como filtros opcionales
    if (request.page !== undefined && request.page !== null) {
      conditions.push(`@page = @${params.length}`);
      params.push(request.page);
    }

    if (request.pageSize !== undefined && request.pageSize !== null) {
      conditions.push(`@pageSize = @${params.length}`);
      params.push(request.pageSize);
    }

    // 2. Mapear filtros del DTO definidos en tu arreglo 'mappings'
    mappings.forEach((m) => {
      const value = request[m.key];
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${m.param} = @${params.length}`);
        params.push(value);
      }
    });

    // 3. Agregar userId
    if (userId) {
      conditions.push(`@userId = @${params.length}`);
      params.push(userId);
    }

    return {
      sql: conditions.join(', '),
      params,
    };
  }
}
