import type { BaseModel } from './base.model';
import type { UserModel } from './user.model';
import type { ProfileType } from '../database/types/profile.type';

export interface AuthCodeModel extends BaseModel {
  userId: string;
  code: string;
  used: boolean;
  expiresAt?: Date;
  user?: UserModel;
}

export interface EmailTemplateModel extends BaseModel {
  name: string;
  subject: string;
  note: string;
  template: string;
}

export interface NotificationModel extends BaseModel {
  title: string;
  description: string;
}

export interface DynamicFieldModel {
  id: number;
  profileType?: ProfileType;
  profile: string;
  jsonData: string;
  userId?: string;
  user?: UserModel;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataUserProfileModel {
  id: number;
  userId?: string;
  user?: UserModel;
  profileDataId?: number;
  profileData?: DynamicFieldModel;
  jsonData?: string;
}
