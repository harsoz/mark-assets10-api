import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAssetDTO,
  UpdateAssetDTO,
} from '../dtos/create-and-update-group.dto';
import {
  AssetRepository,
  ProjectFileRepository,
  ProjectRepository,
  UserRepository,
} from 'src/infrastructure/repository';
import { DataSource } from 'typeorm';
import { BaseCommand } from './base.command';
import { StorageService } from 'src/shared/third-parties/storage.service';
import { ProfileType } from 'src/domain/types/profile.type';
import { ProjectReadModel } from 'src/domain/models';

@Injectable()
export class AssetCommand extends BaseCommand {
  constructor(
    protected readonly _dataSource: DataSource,
    protected readonly _projectRepository: ProjectRepository,
    protected readonly _storageService: StorageService,
    protected readonly _userRepository: UserRepository, // probably this will be replaced by a service userManager
    protected readonly _projectFileRepository: ProjectFileRepository,
    protected readonly _assetRepository: AssetRepository,
  ) {
    super(_dataSource, _projectRepository, _storageService);
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
    const projectData = project as CreateAssetDTO;

    const user = await this._userRepository.findOne({
      where: { id: ownerId },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${ownerId} does not exist`);
    }

    // upload the main picture, not big deal if fails
    const mainPictureUrl = await this.uploadMainPicture(files.MainPicture);

    const projectCreated = await this._projectRepo.create({
      // probably need to map all props
      ...projectData,
      // handle approver, lawyer or analyst
      approverId: user.profileType === ProfileType.Agent ? ownerId : undefined,
      lawyerId: user.profileType === ProfileType.Lawyer ? ownerId : undefined,
      analystId: user.profileType === ProfileType.Analyst ? ownerId : undefined,

      // attach main picture
      mainPicture: mainPictureUrl,
    });

    // create the asset here

    const assetCreated = await this._assetRepository.create({
      ...projectData,
      projectId: projectCreated.id,
    });

    // upload the project files
    const projectFiles = await this.uploadFiles(
      projectCreated.id,
      files.Galery,
      files.Files,
    );

    // save the projectFiles to project
    await Promise.all(
      projectFiles.map((file) => this._projectFileRepository.create(file)),
    );

    return {
      ...projectCreated,
      details: { ...assetCreated },
    } as ProjectReadModel;
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
    const projectData = project as UpdateAssetDTO;

    const parentProject = this._projectRepo.findById(projectId);
    const childProject = this._assetRepository.findById(projectId);

    if (!parentProject && !childProject) {
      throw new NotFoundException(
        `project with id ${projectId} does not exist`,
      );
    }

    const removedFiles = projectData.removedFiles?.split(',') || [];
    removedFiles.forEach(async (file: string) => {
      await this._projectFileRepository.delete(file);
    });

    const projectFiles = await this.uploadFiles(
      projectId,
      files.Galery,
      files.Files,
    );

    await Promise.all(
      projectFiles.map((file) => this._projectFileRepository.create(file)),
    );

    // need to split props between project and asset
    const projectUpdated = await this._projectRepo.update(projectId, {
      ...projectData,
    });

    const assetUpdated = await this._assetRepository.update(projectId, {
      ...projectData,
    });

    return {
      ...projectUpdated,
      details: { ...assetUpdated },
    } as ProjectReadModel;
  }
}
