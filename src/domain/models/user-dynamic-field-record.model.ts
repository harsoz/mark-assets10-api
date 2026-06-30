import { DynamicFieldModel } from './other.model';

export interface UserDynamicFieldRecordModel {
  userId: string;
  profile: string;
  dynamicField?: DynamicFieldModel;
  dynamicFieldValues?: string;
}
