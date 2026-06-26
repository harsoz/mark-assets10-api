import { Injectable } from '@nestjs/common';
import { ProjectCollectionService } from './project-collection.service';
import { ProjectRepository } from 'src/infrastructure/repository';
import { GetProjectDTO } from './dtos/get-project.dto';
import { ProjectType } from 'src/domain/types/project.type';
import { ProjectFileModel, ProjectReadModel } from 'src/domain/models';
import { ProjectQueryService } from './queries/project-query.service';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { FilesDTO } from './dtos/file.dto';
import { CommandCollection } from './commands/collection.command';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly projectCollectionService: ProjectCollectionService,
    private readonly queryService: ProjectQueryService,
    private readonly commandCollection: CommandCollection,
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
    return this.queryService.getAll(request);
  }

  /**
   * @param request
   * @param userId
   * @returns all projects of a user
   */
  async getAllByUserId(request: GetProjectDTO, userId: string) {
    return this.queryService.getAllByUserId(request, userId);
  }

  async create(
    projectType: ProjectType,
    project: any,
    ownerId: string,
    files: FilesDTO,
  ) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.create(project, ownerId, files);
  }

  async update(
    projectType: ProjectType,
    project: any,
    ownerId: string,
    files: FilesDTO,
  ) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.update(project, ownerId, files);
  }

  async cancel(
    projectType: ProjectType,
    projectId: string,
    approverId: string,
  ) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.cancel(projectId, approverId);
  }

  async pendingCloseDeal(
    projectType: ProjectType,
    projectId: string,
    buyerId: string,
  ) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.pendingCloseDeal(projectId, buyerId);
  }

  async rejectDeal(projectType: ProjectType, projectId: string) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.rejectDeal(projectId);
  }

  async expire(projectType: ProjectType, expireDays: number) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.expire(expireDays);
  }

  async delete(projectType: ProjectType, projectId: string) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.delete(projectId);
  }

  async deleteByDays(
    projectType: ProjectType,
    expireDays: number,
    statusToDelete: ProjectStatus[],
  ) {
    const command = this.commandCollection.getCommand(projectType);

    if (!command) throw new Error(`Command not found for: ${projectType}`);

    return await command.deleteByDays(expireDays, statusToDelete);
  }
}
