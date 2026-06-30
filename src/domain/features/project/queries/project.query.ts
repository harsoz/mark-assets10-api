import { Injectable } from '@nestjs/common';
import { GetProjectDTO } from '../dtos/get-project.dto';
import { ProjectType } from 'src/domain/types/project.type';
import { DataSource } from 'typeorm';
import { UserModel } from 'src/domain/models';
import { UserViewModel } from './view/user-view.model';
import { ProjectViewModel } from './view/project-view.model';
import { ProjectCollectionService } from '../project-collection.service';
import {
  ProjectRepository,
  UserRepository,
} from 'src/infrastructure/repository';
import {
  mapEducation,
  mapProfessionalExperience,
  mapUser,
  mapUserDynamicField,
} from 'src/infrastructure/repository/mappers';

/**
 *  The intention is to query the database for projects and leverage store procedures to improve performance from db side
 *  some object props are not available in ProjectViewModel, but in case of required we have to tune the sp_getProjectsFilteredByType
 *  to include missing objects or to use appropiate repo from projectCollection to get any missed prop
 * */
@Injectable()
export class ProjectQuery {
  constructor(
    private readonly _dataSource: DataSource, // we should use an adapter
    private readonly _projectCollectionService: ProjectCollectionService,
    private readonly _projectRespository: ProjectRepository,
    private readonly _userRespository: UserRepository,
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
    const query = this._projectRespository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.owner', 'owner')
      .innerJoinAndSelect('project.analyst', 'analyst')
      .innerJoinAndSelect('project.lawyer', 'laywer')
      .innerJoinAndSelect('project.approver', 'approver')
      .andWhere('project.id = :projectId', { projectId });

    const project = await query.getOne();

    if (!project) throw new Error('Project does not exists');

    const users = [
      project.owner,
      project.analyst,
      project.lawyer,
      project.approver,
    ]
      .filter((user) => user !== null)
      .map((user) => mapUser(user!));

    return users as UserModel[];
  }

  async getUserWithProjects(userId: string): Promise<any> {
    const query = this._userRespository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dynamicFields', 'dynamicFields')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect(
        'user.professionalExperience',
        'professionalExperience',
      )
      .leftJoinAndSelect('user.education', 'education')
      .where('user.id = :userId', { userId });

    const user = await query.getOne();

    if (!user) throw new Error('User does not exists');

    const projects = await this._projectRespository.findAll({
      where: { owner: { id: userId } },
    });

    const mappedUser = {
      ...user,
      dynamicFields: user.dynamicFields?.map((field) =>
        mapUserDynamicField(field),
      ),
      professionalExperience: user.professionalExperience?.map((experience) =>
        mapProfessionalExperience(experience),
      ),
      education: user.education?.map((education) => mapEducation(education)),
      roles: user.roles?.map((role) => role.name),
      // if we need project details, we should use get() instead and configure map function for project
      projects: projects.map((project) =>
        this._projectRespository.toModel(project),
      ),
    };

    return mappedUser as UserViewModel;
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
