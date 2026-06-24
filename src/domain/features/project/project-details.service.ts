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
      'EXEC sp_getAllProjectsByType @type = @0',
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
      `EXEC dbo.sp_getAllProjectsByType ${sql}`,
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
      `EXEC dbo.sp_getAllProjectsByType ${sql}`,
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
    let sql = '';
    const params: any[] = [request.page ?? 1, request.pageSize ?? 0];

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

    mappings.forEach((m) => {
      const value = request[m.key];
      if (value !== undefined && value !== null && value !== '') {
        sql += `, ${m.param} = @${params.length}`;

        // manage type: if this gets complicated, we can separate this to another service or method
        const paramValue = m.key === 'projectType' ? ProjectType[value as keyof typeof ProjectType] : value;
        
        // we need to handle @type here per projectType: it has a subtype >:v damn it
        
        params.push(paramValue);
      }

      // make avaliable to filter by userid
      if (userId) {
        sql += `, @userId = @${params.length}`;
        params.push(userId);
      }
    });

    return { sql, params };
  }
}
