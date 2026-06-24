import { Injectable } from '@nestjs/common';
import {
  ProjectCollectionService,
  ProjectRegistry,
  ProjectRegistryEntities,
} from './project-collection.service';
import { ProjectRepository } from 'src/infrastructure/repository';
import { GetProjectDTO } from './dtos/get-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    // private readonly dataSource: DataSource,
    private readonly projectRepo: ProjectRepository,
    private readonly projectCollectionService: ProjectCollectionService,
    // private readonly stateMachine: ProjectStateMachine,
  ) {}

  async getById(id: string) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new Error('Project does not exists');

    const repo = this.projectCollectionService.getProjectDetailEngine(
      project.projectType,
    );

    const details = await repo.findById(project.id);

    return {
      ...this.projectRepo.toModel(project),
      ...repo.toModel(details as any),
    };
  }

  async getAllProjects() {
    const query = this.projectRepo.createQueryBuilder('project');
    const [data, totalCount] = await query
      .orderBy('project.createdAt', 'DESC')
      .getManyAndCount();

    const parsedData = data.map((project) => this.projectRepo.toModel(project));
    return { totalCount, data: parsedData };
  }

  async getAll(request: GetProjectDTO) {
    const query = this.projectRepo.createQueryBuilder('project');
    const [data, totalCount] = await query
      .orderBy('project.createdAt', 'DESC')
      .skip((request.pageSize || 0) * ((request.page || 0) - 1))
      .take(request.pageSize)
      .getManyAndCount();

    const parsedData = data.map((project) => this.projectRepo.toModel(project));
    return { totalCount, data: parsedData };
  }

  //   async getAllByUserId(request: GetProjectDTO, userId: string) {
  //     const query = this.projectRepo
  //       .buildQuery(request)
  //       .where(
  //         '(project.ownerId = :u OR project.approverId = :u OR project.clientId = :u OR project.lawyerId = :u OR project.analystId = :u)',
  //         { u: userId },
  //       );
  //     const [data, totalCount] = await query.getManyAndCount();
  //     return { totalCount, data };
  //   }

  //   async getProjectCountByUserId(userId: string): Promise<number> {
  //     return await this.projectRepo.count({
  //       where: {
  //         ownerId: userId,
  //         status: Not(In([ProjectStatus.Closed, ProjectStatus.Cancelled])),
  //       },
  //     });
  //   }

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
}
