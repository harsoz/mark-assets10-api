import { ProjectRecordModel } from 'src/domain/models/project-record.model';

export interface ProjectViewModel extends Omit<
  ProjectRecordModel,
  // need to manage this in sql query or to change the procedures when needed
  | 'country'
  | 'state'
  | 'city'
  | 'owner'
  | 'approver'
  | 'lawyer'
  | 'analyst'
  | 'client'
  | 'projectFiles'
  | 'details'
> {
  details: any;
}
