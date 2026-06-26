import { ProjectFileModel } from './project.model';

export interface FilesUploadedModel {
  mainPicture: string;
  files: ProjectFileModel[];
}
