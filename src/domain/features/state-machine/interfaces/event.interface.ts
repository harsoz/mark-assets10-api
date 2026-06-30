import { ProjectModel } from 'src/domain/models';

export interface IEvent {
  run(project: ProjectModel);
}
