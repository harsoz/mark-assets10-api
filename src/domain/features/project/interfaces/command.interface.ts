import { FilesUploadedModel, ProjectFileModel, ProjectModel } from 'src/domain/models';
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
  updateStatus(projectId: string, status: ProjectStatus): Promise<ProjectModel>;
}




// pending
// Task<List<ABSUser>> GetUsersFromProject(ProjectType projectType, string projectId);
// Task<ABSUser> GetUserWithProjects(string userId);

// pending
// Task<ProjectFilesDTO> ProcessFiles(IFormFile? MainPicture, List<IFormFile>? Galery, List<IFormFile>? Files, FileType fileType = FileType.File);

// completed
// Task<ABSProjects> GetAll(GetProjectDTO request, string userId, string projectType);
// Task<int> GetProjectCountByUserId(string userId);
// Task<Project> GetProjectByIdAndType(ProjectType projectType, string projectId);
// Task<Project> Delete(ProjectType projectType, string projectId);
// Task<Project> PendingClosedDeal(ProjectType projectType, string projectId, string buyerId);
// Task<Project> Cancel(ProjectType projectType, string projectId, string approverId);
// Task<Project> Approve(ProjectType projectType, string projectId, string approverId);
// Task<Project> RejectDeal(ProjectType projectType, string projectId);
// Task<Project> AssignApprover(ProjectType projectType, string projectId, string approverId, int userProjectCapacity);
// Task<Project> AssignLawyer(ProjectType projectType, string projectId, string lawyerId, int userProjectCapacity);
// Task<Project> AssignAnalyst(ProjectType projectType, string projectId, string analystId, int userProjectCapacity);
// Task<Project> UpdateStatus(ProjectType projectType, string projectId, ProjectStatus status);
// isProjectAssigned()
// getProjectsCountByUserId()
// Task<Project> Complete(ProjectType projectType, string projectId);
// Task<Project> CloseAgreement(ProjectType projectType, string projectId, string buyerId);
// Task<Project> AddContractToProject(ProjectType projectType, FileType contractType, List<ProjectFile> files, string projectId);


// completed but missing notifications & emails
// Task DeleteProejctByDateAndStatus(ProjectType projectType, int daysToExpire, List<ProjectStatus?> statusToDelete); missing notification
// Task ExpireProjectsByDate(ProjectType projectType, int daysToExpire, string emails); missing notification
