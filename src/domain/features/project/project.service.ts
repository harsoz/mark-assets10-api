import { Injectable } from '@nestjs/common';
import { ProjectCollectionService } from './project-collection.service';
import { ProjectRepository } from 'src/infrastructure/repository';
import { GetProjectDTO } from './dtos/get-project.dto';
import { ProjectType } from 'src/domain/types/project.type';
import { In, Not } from 'typeorm';
import { ProjectReadModel } from 'src/domain/models';
import { ProjectDetailsService } from './project-details.service';
import { ProjectStatus } from 'src/domain/types/project-status.type';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly projectCollectionService: ProjectCollectionService,
    private readonly projectDetailsService: ProjectDetailsService,
    // private readonly stateMachine: ProjectStateMachine,
  ) {}

  /**
   * @param request
   * @param id
   * @returns a project by id
   */
  async getById(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new Error('Project does not exists');

    const repo = this.projectCollectionService.getProjectDetailEngine(
      project.projectType,
    );

    const details = await repo.findById(project.id);

    return {
      ...this.projectRepo.toModel(project),
      details: repo.toModel(details as any),
    } as ProjectReadModel;
  }

  /**
   * @param request
   * @param userId
   * @returns all projects
   */
  async getAll(request: GetProjectDTO) {
    return this.projectDetailsService.getAll(request);
  }

  /**
   * @param request
   * @param userId
   * @returns all projects of a user
   */
  async getAllByUserId(request: GetProjectDTO, userId: string) {
    return this.projectDetailsService.getAllByUserId(request, userId);
  }

  /**
   * @param request
   * @param userId
   * @returns project count by type that belongs an owner
   */
  async getProjectCountByTypeAndOwnerId(
    ownerId: string,
    projectType: string, // potentially as string
  ): Promise<number> {
    return await this.projectRepo.count({
      where: {
        ownerId,
        projectType: ProjectType[projectType as keyof typeof ProjectType],
        status: Not(In([ProjectStatus.Closed, ProjectStatus.Cancelled])),
      },
    });
  }

  //   // --- CICLO DE VIDA Y DEAL FLOW ---
  //   async cancel(projectId: string, approverId: string) {
  //     const project = await this.projectRepo.findOneBy({ id: projectId });
  //     if (!project) throw new ProjectDoesNotExistException();

  //     if (
  //       !this.stateMachine.canTransition(project.status, ProjectStatus.Cancelled)
  //     )
  //       throw new InvalidStatusChangeException();

  //     project.status = ProjectStatus.Cancelled;
  //     return await this.projectRepo.save(project);
  //   }

  //   async pendingCloseDeal(projectId: string, contractorId: string) {
  //     const project = await this.projectRepo.findOneBy({ id: projectId });
  //     if (!project) throw new ProjectDoesNotExistException();

  //     project.status = ProjectStatus.PendingClosed;
  //     project.clientId = contractorId;
  //     return await this.projectRepo.save(project);
  //   }

  //   async rejectDeal(projectId: string) {
  //     const project = await this.projectRepo.findOneBy({ id: projectId });
  //     project.status = ProjectStatus.Rejected;
  //     project.clientId = null;
  //     return await this.projectRepo.save(project);
  //   }

  //   // --- MANTENIMIENTO Y EXPIRACIÓN ---
  //   async expire(expireDays: number) {
  //     const threshold = new Date();
  //     threshold.setDate(threshold.getDate() - expireDays);

  //     const query = this.projectRepo
  //       .createQueryBuilder('p')
  //       .where('p.status = :s AND p.updatedAt <= :t', {
  //         s: ProjectStatus.Approved,
  //         t: threshold,
  //       });

  //     const projects = await query.getMany();
  //     await query.update().set({ status: ProjectStatus.Expired }).execute();
  //     return projects;
  //   }

  //   async delete(projectId: string) {
  //     return await this.dataSource.transaction(async (manager) => {
  //       await manager.delete(ProjectFile, { projectId });
  //       await manager.delete(Project, projectId);
  //       return true;
  //     });
  //   }

  //   async deleteByDays(expireDays: number, statusToDelete: ProjectStatus[]) {
  //     const threshold = new Date();
  //     threshold.setDate(threshold.getDate() - expireDays);

  //     return await this.dataSource.transaction(async (manager) => {
  //       const projects = await manager.find(Project, {
  //         where: { status: In(statusToDelete), updatedAt: LessThan(threshold) },
  //       });

  //       const ids = projects.map((p) => p.id);
  //       await manager.delete(ProjectFile, { projectId: In(ids) });
  //       await manager.delete(Project, { id: In(ids) });

  //       return projects;
  //     });
  //   }

  // maybe deprecated
  // private buildStoredProcedureParams(request: GetProjectDTO) {
  //   let sql = '@page = @0, @pageSize = @1';
  //   const params: any[] = [request.page ?? 1, request.pageSize ?? 0];

  //   // we might use the GetProjectDTO keys
  //   const mappings = [
  //     { key: 'type', param: '@type' },
  //     { key: 'countryId', param: '@countryId' },
  //     { key: 'stateId', param: '@stateId' },
  //     { key: 'cityId', param: '@cityId' },
  //     { key: 'status', param: '@status' },
  //     { key: 'minPrice', param: '@minPrice' },
  //     { key: 'maxPrice', param: '@maxPrice' },
  //   ];

  //   mappings.forEach((m) => {
  //     const value = request[m.key];
  //     if (value !== undefined && value !== null && value !== '') {
  //       sql += `, ${m.param} = @${params.length}`;
  //       params.push(value);
  //     }
  //   });

  //   return { sql, params };
  // }
}
