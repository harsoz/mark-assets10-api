import { Injectable } from '@nestjs/common';
import { GetProjectDTO } from '../dtos/get-project.dto';
import { ProjectType } from 'src/domain/types/project.type';
import { DataSource } from 'typeorm';
import { ProjectModel, UserModel } from 'src/domain/models';
import { UserViewModel } from './view/user-view.model';
import { ProjectViewModel } from './view/project-view.model';
import { ProjectCollectionService } from '../project-collection.service';
import { ProjectRepository } from 'src/infrastructure/repository';

/**
 *  The intention is to query the database for projects and leverage store procedures to improve performance from db side
 *  some object props are not available in ProjectViewModel, but in case of required we have to tune the sp_getProjectsFilteredByType
 *  to include missing objects or to use appropiate repo from projectCollection to get any missed prop
 * */
@Injectable()
export class ProjectQueryService {
  constructor(
    private readonly _dataSource: DataSource, // we should use an adapter
    private readonly _projectCollectionService: ProjectCollectionService,
    private readonly _projectRespository: ProjectRepository,
  ) {}

  async getById(id: string) {
    const project = await this._projectRespository.findById(id);
    if (!project) throw new Error('Project does not exists');

    const repo = this._projectCollectionService.getRepository(
      project.projectType,
    );

    const details = await repo.findById(project.id);

    return {
      ...this._projectRespository.toModel(project),
      details: repo.toModel(details as any),
    } as ProjectViewModel;
  }

  /**
   * @kind readonly data - crud operations not available for entities
   * @returns all projects by type not paginated
   */
  async getAllProjects(projectType: ProjectType) {
    const rawResults = (await this._dataSource.query(
      'EXEC sp_getProjectsFilteredByType @type = @0',
      [projectType],
    )) as ProjectViewModel[];

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
    return this.get(sql, params);
  }

  /**
   * @kind readonly data - crud operations not available for entities
   * @returns all projects by type and userid paginated conditionally
   */
  async getAllByUserId(request: GetProjectDTO, userId: string) {
    // it seems like only valid projects are retrieved per user
    request.isActive = true;
    const { sql, params } = this.buildStoredProcedureParams(request, userId);
    return this.get(sql, params);
  }

  async getUsersFromProject(projectId: string) {
    const users = await this._dataSource.query(
      'EXEC GetProjectUsers @ProjectId = @0',
      [projectId],
    );

    return users as UserModel[];
  }

  // replaces GetUserWithProjects method on legacy
  async getUserFullDetails(userId: string): Promise<UserViewModel> {
    // we also can use userRepository to get the user and projectRepository to get the projects
    // but we are leveraging db to use indexes efficiently for queries
    const result = await this._dataSource.query(
      'EXEC dbo.sp_getUserFullDetails @UserId = @0',
      [userId],
    );

    const [userRaw, dynamicFields, roles, experience, education, projectsRaw] =
      result;

    const user: UserViewModel = {
      ...userRaw[0],
      dynamicFields: dynamicFields,
      roles: roles,
      professionalExperience: experience,
      education: education,
      projects: projectsRaw as ProjectModel[],
    };

    return user;
  }

  private async get(sql: string, params: any[]) {
    const rawResults = (await this._dataSource.query(
      `EXEC dbo.sp_getProjectsFilteredByType ${sql}`,
      [...params],
    )) as ProjectViewModel[];

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

    if (request.page !== undefined && request.page !== null) {
      conditions.push(`@page = @${params.length}`);
      params.push(request.page);
    }

    if (request.pageSize !== undefined && request.pageSize !== null) {
      conditions.push(`@pageSize = @${params.length}`);
      params.push(request.pageSize);
    }

    mappings.forEach((m) => {
      const value = request[m.key];
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${m.param} = @${params.length}`);
        params.push(value);
      }
    });

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
