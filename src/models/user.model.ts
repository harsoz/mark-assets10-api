import type { BaseModel } from './base.model';
import type { CountryModel, StateModel, CityModel } from './location.model';
import type { ProjectModel } from './project.model';
import type { DynamicFieldModel, DataUserProfileModel } from './other.model';
import type { LanguageType } from '../database/types/language.type';
import type { UserStatus } from '../database/types/user-status.type';
import type { ProfileType } from '../database/types/profile.type';
import type { ProjectType } from '../database/types/project.type';
import type { ProjectStatus } from '../database/types/project-status.type';

export interface RoleModel extends BaseModel {
  name: string;
  isAdmin: boolean;
}

export interface EducationModel {
  id: number;
  institution: string;
  title: string;
  certificationName: string;
  institutionCertifies: string;
  certificationYear: string;
  from?: Date;
  to?: Date;
  userId: string;
  user?: UserModel;
}

export interface ProfessionalExperienceModel {
  id: number;
  company: string;
  position: string;
  activities: string;
  from?: Date;
  to?: Date;
  countryId?: number;
  country?: CountryModel;
  userId: string;
  user?: UserModel;
}

export interface VerifiedPhoneModel extends BaseModel {
  phoneNumber: string;
  userId?: string;
  user?: UserModel;
}

export interface TrustedDeviceModel extends BaseModel {
  userId: string;
  deviceId: string;
  expiresAt?: Date;
  user?: UserModel;
}

export interface UserDynamicFieldModel {
  id: number;
  profileType?: ProfileType;
  profile: string;
  jsonData: string;
  userId?: string;
  user?: UserModel;
}

export interface UserProjectModel {
  id: number;
  userId?: string;
  projectId: string;
  project?: ProjectModel;
  projectType: ProjectType;
  status?: ProjectStatus;
}

export interface UserModel extends BaseModel {
  email: string;
  phoneNumber?: string;
  name: string;
  password: string;
  phoneVerificationCode: string;
  rewardClaimed: boolean;
  isAdmin: boolean;
  isFirstPasswordChanged: boolean;
  status: UserStatus;
  aboutMe?: string;
  xSocial?: string;
  linkedIn?: string;
  logo?: string;
  profilePicture?: string;
  address?: string;
  projectCapacity?: number;
  aboutCompany?: string;
  language: LanguageType;
  roles?: RoleModel[];
  professionalExperience?: ProfessionalExperienceModel[];
  education?: EducationModel[];
  verifiedPhones?: VerifiedPhoneModel[];
  dynamicFields?: UserDynamicFieldModel[];
  trustedDevices?: TrustedDeviceModel[];
  countryId?: number;
  country?: CountryModel;
  stateId?: number;
  state?: StateModel;
  cityId?: number;
  city?: CityModel;
  dataProfiles?: DataUserProfileModel[];
}
