import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectFileModel } from 'src/domain/models';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { ICommand } from '../interfaces/command.interface';
import { CreateAssetDTO } from '../dtos/create-group.dto';
import {
  AssetRepository,
  ProjectRepository,
} from 'src/infrastructure/repository';
import { Multer } from 'multer';
import { DataSource, In, LessThan } from 'typeorm';
import { Asset, Project, ProjectFile } from 'src/infrastructure/database';

@Injectable()
export class AssetCommandService implements ICommand {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _projectRepo: ProjectRepository,
    private readonly _assetRepo: AssetRepository,
  ) {}

  async create(project: any, ownerId: string, files: Multer.File[]) {
    const projectData = project as CreateAssetDTO;
  }

  async update(project: any, projectId: string, files: ProjectFileModel[]) {}

  async cancel(projectId: string, approverId: string) {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    project.status = ProjectStatus.Cancelled;

    await this._projectRepo.update(projectId, project);
  }

  async expire(expireDays: number) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - expireDays);
    const query = this._projectRepo
      .createQueryBuilder('p')
      .where('p.status = :s AND p.updatedAt <= :t', {
        s: ProjectStatus.Approved,
        t: threshold,
      });
    await query.update().set({ status: ProjectStatus.Expired }).execute();
  }

  async pendingCloseDeal(projectId: string, buyerId: string) {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    project.status = ProjectStatus.PendingClosed;
    project.clientId = buyerId;

    await this._projectRepo.update(projectId, project);
  }

  async rejectDeal(projectId: string) {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    project.status = ProjectStatus.Rejected;
    project.clientId = undefined;

    await this._projectRepo.update(projectId, project);
  }

  async delete(projectId: string) {
    return await this._dataSource.transaction(async (manager) => {
      const project = await manager.findOneBy(Project, {
        id: projectId,
      });
      if (project) {
        // we can delete projectFile potentially by cascade on projects
        // await manager.delete(ProjectFile, { projectId: projectId }); // potentially deleted on cascade
        await manager.delete(Project, { id: projectId }); // this will delete on cascade the asset
      }
    });
  }

  async deleteByDays(expireDays: number, statusToDelete: ProjectStatus[]) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - expireDays);

    return await this._dataSource.transaction(async (manager) => {
      const projects = await manager.find(Project, {
        where: { status: In(statusToDelete), updatedAt: LessThan(threshold) },
      });

      const ids = projects.map((p) => p.id);
      // we can delete projectFile potentially by cascade on projects
      // await manager.delete(ProjectFile, { projectId: In(ids) }); // potentially deleted on cascade
      await manager.delete(Project, { id: In(ids) }); // this will delete on cascade the asset
    });
  }
}
