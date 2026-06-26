import { ProfileType } from '../types/profile.type';
import { DynamicFieldModel } from './other.model';

export interface UserDynamicFieldRecordModel {
  userId: string;
  profile: string;
  dynamicField?: DynamicFieldModel;
  dynamicFieldValues?: string;
}
