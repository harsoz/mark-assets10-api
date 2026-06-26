import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFinancingDTO,
  UpdateFinancingDTO,
} from '../dtos/create-and-update-group.dto';
import {
  ProjectFileRepository,
  ProjectRepository,
  UserRepository,
} from 'src/infrastructure/repository';
import { BaseCommand } from './base.command';
import { StorageService } from 'src/shared/third-parties/storage.service';
import { ProfileType } from 'src/domain/types/profile.type';
import { Financing, Project, ProjectFile } from 'src/infrastructure/database';
import { UnitOfWork } from 'src/infrastructure/database/utils/unit-of-work.util';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { ProjectRecordModel } from 'src/domain/models/project-record.model';

@Injectable()
export class FinancingCommand extends BaseCommand {
  constructor(
    // base
    protected readonly _unitOfWork: UnitOfWork,
    protected readonly _projectRepository: ProjectRepository,
    protected readonly _storageService: StorageService,
    // required as needed per project
    protected readonly _userRepository: UserRepository, // probably this will be replaced by a service userManager
    protected readonly _projectFileRepository: ProjectFileRepository,
  ) {
    super(_unitOfWork, _projectRepository, _storageService);
  }

  async create(
    project: any,
    ownerId: string,
    files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
    },
  ) {
    const projectData = project as CreateFinancingDTO;

    return await this._unitOfWork.runInTransaction(async (manager) => {
      const user = await this._userRepository.findOne({
        where: { id: ownerId },
      });
      if (!user) throw new NotFoundException(`User ${ownerId} not found`);

      const mainPictureUrl = await this.uploadMainPicture(files.MainPicture);
      const {
        projectSubtype,
        amount,
        dontDisclouse,
        landAvailable,
        activeType,
        ...projectDraft
      } = projectData;

      const projectCreated = manager.create(Project, {
        ...projectDraft,
        status:  ProjectStatus.PendingResources,
        approverId:
          user.profileType === ProfileType.Agent ? ownerId : undefined,
        lawyerId: user.profileType === ProfileType.Lawyer ? ownerId : undefined,
        analystId:
          user.profileType === ProfileType.Analyst ? ownerId : undefined,
        mainPicture: mainPictureUrl,
      });
      await manager.save(projectCreated);

      const financingCreated = manager.create(Financing, {
        projectSubtype,
        amount,
        dontDisclouse,
        landAvailable,
        activeType,
        projectId: projectCreated.id,
      });
      await manager.save(financingCreated);

      const projectFiles = await this.uploadFiles(
        projectCreated.id,
        files.Galery,
        files.Files,
      );

      const fileEntities = projectFiles.map((file) =>
        manager.create(ProjectFile, { ...file, projectId: projectCreated.id }),
      );
      await manager.save(ProjectFile, fileEntities);

      return {
        ...projectCreated,
        details: { ...financingCreated },
      } as ProjectRecordModel;
    });
  }

  async update(
    project: any,
    projectId: string,
    files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
    },
  ) {
    const projectData = project as UpdateFinancingDTO;

    return await this._unitOfWork.runInTransaction(async (manager) => {
      const financing = await manager.findOne(Financing, {
        where: { projectId },
      });
      if (!financing) {
        throw new NotFoundException(
          `Financing for project ${projectId} not found`,
        );
      }

      const removedFiles =
        projectData.removedFiles?.split(',').filter(Boolean) || [];
      for (const fileId of removedFiles) {
        await manager.delete(ProjectFile, fileId);
      }

      const {
        projectSubtype,
        amount,
        dontDisclouse,
        landAvailable,
        activeType,
        ...projectDraft
      } = projectData;

      const newProjectFiles = await this.uploadFiles(
        projectId,
        files.Galery,
        files.Files,
      );
      if (newProjectFiles.length > 0) {
        await manager.save(
          ProjectFile,
          newProjectFiles.map((f) => ({ ...f, projectId })),
        );
      }

      // we have to validate MainPicture, probably we can send mainPicture as part of the dto
      // since we would have a url
      let updatedProject = await manager.findOne(Project, {
        where: { id: projectId },
      });

      let mainPictureUrl = updatedProject?.mainPicture;

      if (updatedProject && files.MainPicture) {
        mainPictureUrl = await this.uploadMainPicture(files.MainPicture);
      }

      await manager.update(
        Project,
        { id: projectId },
        { ...projectDraft, mainPicture: mainPictureUrl },
      );
      await manager.update(
        Financing,
        { projectId },
        { projectSubtype, amount, dontDisclouse, landAvailable, activeType },
      );

      updatedProject = await manager.findOne(Project, {
        where: { id: projectId },
      });

      const updatedFinancing = await manager.findOne(Financing, {
        where: { projectId },
      });

      return {
        ...updatedProject,
        details: updatedFinancing,
      } as ProjectRecordModel;
    });
  }
}
