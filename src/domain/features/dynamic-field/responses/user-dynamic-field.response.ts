import { DynamicFieldModel } from '../../../models/other.model';

export interface UserDynamicFieldResponse {
  userId: string;
  profile: string;
  dynamicField?: DynamicFieldModel;
  dynamicFieldValues?: string;
}
