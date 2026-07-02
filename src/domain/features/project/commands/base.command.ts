import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { ICommand } from '../interfaces/command.interface';
import { ProjectRepository, UnitOfWork } from 'src/infrastructure/repository';
import { In, LessThan, Not } from 'typeorm';
import { Project, ProjectFile } from 'src/infrastructure/database';
import { ProjectFileModel, ProjectModel } from 'src/domain/models';
import { FileType } from 'src/domain/types/file.type';
import { ProjectType } from 'src/domain/types/project.type';
import { StorageService } from 'src/shared/third-parties/storage.service';

export abstract class BaseCommand implements ICommand {
  constructor(
    protected readonly _unitOfWork: UnitOfWork,
    protected _projectRepo: ProjectRepository,
    protected _storageService: StorageService,
  ) {}

  abstract create(
    project: any,
    ownerId: string,
    files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
    },
  );

  abstract update(
    project: any,
    projectId: string,
    files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
    },
  );

  async complete(projectId: string): Promise<void> {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    // we should use state machine
    await this._projectRepo.update(projectId, { status: ProjectStatus.Closed });
  }

  async cancel(projectId: string, approverId: string) {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    // we should use state machine
    await this._projectRepo.update(projectId, {
      status: ProjectStatus.Cancelled,
    });
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

    // we should use state machine
    await this._projectRepo.update(projectId, {
      clientId: buyerId,
      status: ProjectStatus.PendingClosed,
    });
  }

  async rejectDeal(projectId: string) {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    // we should use state machine
    await this._projectRepo.update(projectId, {
      status: ProjectStatus.Rejected,
      clientId: undefined,
    });
  }

  async delete(projectId: string) {
    // we can delete projectFile potentially by cascade on projects
    // await manager.delete(ProjectFile, { projectId: projectId }); // potentially deleted on cascade
    await this._projectRepo.delete(projectId);
  }

  async deleteByDays(expireDays: number, statusToDelete: ProjectStatus[]) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - expireDays);

    return await this._unitOfWork.runInTransaction(async (manager) => {
      const projects = await manager.find(Project, {
        where: { status: In(statusToDelete), updatedAt: LessThan(threshold) },
      });

      const ids = projects.map((p) => p.id);
      // we can delete projectFile potentially by cascade on projects
      // await manager.delete(ProjectFile, { projectId: In(ids) }); // potentially deleted on cascade
      await manager.delete(Project, { id: In(ids) }); // this will delete on cascade the asset
    });
  }

  async assignApprover(
    projectId: string,
    approverId: string,
  ): Promise<ProjectModel> {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    if (this.isProjectAssigned(project))
      // we should validate is assigned against approver only
      throw new BadRequestException('Project is already assigned');

    await this._projectRepo.update(projectId, { approverId: approverId });

    return project as ProjectModel;
  }

  async assignLawyer(
    projectId: string,
    lawyerId: string,
    userProjectCapacity: number,
  ): Promise<ProjectModel> {
    const assigments = await this.getProjectCountByTypeAndOwnerId(lawyerId);
    if (assigments + 1 > userProjectCapacity)
      throw new BadRequestException('lawyer exceeds projects assignment');

    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `the project with id ${projectId} does not exist`,
      );
    }

    if (this.isProjectAssigned(project))
      // we should validate is assigned against approver only
      throw new BadRequestException('project is already assigned');

    await this._projectRepo.update(projectId, { lawyerId: lawyerId });

    return project as ProjectModel;
  }

  async assignAnalyst(
    projectId: string,
    analystId: string,
    userProjectCapacity: number,
  ): Promise<ProjectModel> {
    const assigments = await this.getProjectCountByTypeAndOwnerId(analystId);
    if (assigments + 1 > userProjectCapacity)
      throw new BadRequestException('analyst exceeds projects assignment');

    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `the project with id ${projectId} does not exist`,
      );
    }

    if (this.isProjectAssigned(project))
      // we should validate is assigned against approver only
      throw new BadRequestException('project is already assigned');

    await this._projectRepo.update(projectId, { analystId: analystId });

    return project as ProjectModel;
  }

  async closeAgreement(
    projectId: string,
    buyerId: string,
  ): Promise<ProjectModel> {
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`El activo con ID ${projectId} no existe`);
    }

    // we should use state machine
    await this._projectRepo.update(projectId, {
      status: ProjectStatus.AgreementClosed,
      clientId: buyerId,
    });

    return project as ProjectModel;
  }

  async addContract(
    contractType: FileType, // this is used to determine the status
    files: ProjectFileModel[], // files should come validated or validate here
    projectId: string,
  ): Promise<ProjectModel> {
    // 1. Buscamos el proyecto incluyendo la relación de archivos
    const project = await this._projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    // probably we don't update status here
    // if (validateFiles(files) && project.status !== newStatus) {
    //   project.status = newStatus;
    // }

    for (const file of files) {
      file.project = project;
      project.projectFiles?.push(file as ProjectFile);
    }

    await this._projectRepo.update(projectId, project);

    return project as ProjectModel;
  }

  async uploadFiles(
    projectId: string,
    galery: Express.Multer.File[] | undefined,
    files: Express.Multer.File[] | undefined,
    fileType: FileType = FileType.File,
  ): Promise<ProjectFileModel[]> {
    const galleryFiles = galery
      ? await Promise.all(
          galery.map((file) =>
            this.createProjectFile(projectId, file, FileType.Image),
          ),
        )
      : [];

    const otherFiles = files
      ? await Promise.all(
          files.map((file) =>
            this.createProjectFile(projectId, file, fileType),
          ),
        )
      : [];

    return [...galleryFiles, ...otherFiles] as ProjectFileModel[];
  }

  protected async uploadMainPicture(
    mainPicture: Express.Multer.File | undefined,
  ) {
    let mainPictureUrl = '';
    if (mainPicture) {
      // maybe to validate if the picture is empty buffer to make url = ""
      // we probably need a method to directly remove the mainPicture
      mainPictureUrl = await this._storageService.uploadFile(mainPicture);
    }
    return mainPictureUrl;
  }

  protected isProjectAssigned(project: Project): boolean {
    // should we split this method to only validated against approvedId, lawyerId and analystsId
    // separately? original method is validating this for approver, what happened if project
    // not assigned to approver but for lawyer?
    // potentially safe from front-end side restrictions
    return (
      project.status === ProjectStatus.PendingResources &&
      !!project.approverId &&
      !!project.lawyerId &&
      !!project.analystId
    );
  }

  protected async getProjectCountByTypeAndOwnerId(
    ownerId: string,
  ): Promise<number> {
    return await this._projectRepo.count({
      where: {
        ownerId,
        projectType: ProjectType.Asset,
        status: Not(In([ProjectStatus.Closed, ProjectStatus.Cancelled])),
      },
    });
  }

  protected async createProjectFile(
    projectId: string,
    file: Express.Multer.File,
    type: FileType,
  ): Promise<ProjectFileModel> {
    const url = await this._storageService.uploadFile(file);
    return {
      file: url,
      type: type,
      fileName: file.originalname,
      projectId,
    } as ProjectFileModel;
  }
}
