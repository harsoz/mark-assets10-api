import { ProjectModel, UserModel } from 'src/domain/models';

export interface UserViewModel extends UserModel {
  projects: ProjectModel[];
}
