import { ProjectFileModel, ProjectModel } from 'src/domain/models';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { FileType } from 'src/domain/types/file.type';

export interface ICommand {
  create(project: any, ownerId: string, files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
  }): Promise<any>;
  update(project: any, projectId: string, files: {
      MainPicture?: Express.Multer.File;
      Galery?: Express.Multer.File[];
      Files?: Express.Multer.File[];
  }): Promise<any>;
  cancel(projectId: string, approverId: string): Promise<void>;
  expire(expireDays: number): Promise<void>;
  pendingCloseDeal(projectId: string, buyerId: string): Promise<void>;
  complete(projectId: string): Promise<void>;
  rejectDeal(projectId: string): Promise<void>;
  delete(projectId: string): Promise<void>;
  deleteByDays(expireDays: number, statusToDelete: ProjectStatus[]): Promise<void>;
  addContract(contractType: FileType, files: ProjectFileModel[], projectId: string): Promise<ProjectModel>;
  assignApprover(projectId: string, approverId: string): Promise<ProjectModel>;
  assignLawyer(projectId: string, lawyerId: string, userProjectCapacity: number): Promise<ProjectModel>;
  assignAnalyst(projectId: string, analystId: string, userProjectCapacity: number): Promise<ProjectModel>;
  closeAgreement(projectId: string, buyerId: string): Promise<ProjectModel>;
  uploadFiles(projectId: string, galery: Express.Multer.File[] | undefined, files: Express.Multer.File[] | undefined, fileType: FileType): Promise<ProjectFileModel[]>;
}