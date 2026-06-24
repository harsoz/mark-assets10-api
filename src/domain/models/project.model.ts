import type { BaseModel } from './base.model';
import type { CountryModel, StateModel, CityModel } from './location.model';
import type { UserModel } from './user.model';
import type { Currency } from '../types/currency.type';
import type { MeasureUnit } from '../types/measure-unit.type';
import type { ProjectStatus } from '../types/project-status.type';
import type { FileType } from '../types/file.type';
import type { ProjectType } from '../types/project.type';
import type { DevelopmentSubtype } from '../types/development-subtype.type';
import type { FinancingSubtype } from '../types/financing-subtype.type';
import type { InfrastructureType } from '../types/infrastructure.type';
import type { InfrastructureSegment } from '../types/infrastructure-segment.type';
import type { ServiceType } from '../types/service.type';

export interface ProjectModel extends BaseModel {
  status?: ProjectStatus;
  currency: Currency;
  measureUnit: MeasureUnit;
  projectType: ProjectType;
  title: string;
  address?: string;
  zipCode?: string;
  description?: string;
  mainPicture?: string;
  latitude?: string;
  longitude?: string;
  sellingConditions?: string;
  sellingWindow?: string;
  restrictionsAndRequirements?: string;
  minPrice?: number;
  maxPrice?: number;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  ownerId: string;
  approverId?: string;
  lawyerId?: string;
  analystId?: string;
  clientId?: string;
  country?: CountryModel;
  state?: StateModel;
  city?: CityModel;
  owner?: UserModel;
  approver?: UserModel;
  lawyer?: UserModel;
  analyst?: UserModel;
  client?: UserModel;
  projectFiles?: ProjectFileModel[];
}

export interface ProjectFileModel extends BaseModel {
  type: FileType;
  file: string;
  fileName: string;
  projectId: string;
  project?: ProjectModel;
}

export interface ChildProjectModel {
  projectId: string;
  project?: ProjectModel;
}

export interface ConsultingArchitectureModel extends ChildProjectModel {
  projectSubtype?: DevelopmentSubtype;
  serviceType?: ServiceType;
  landAvailable?: boolean;
}

export interface AssetModel extends ChildProjectModel {
  assetType?: string;
  quantity?: number;
  landArea?: number;
  capRate?: string;
}

export interface DevelopmentModel extends ChildProjectModel {
  projectSubtype?: DevelopmentSubtype;
  landAvailable?: boolean;
  landArea?: number;
  activeType?: string;
  quantity?: number;
}

export interface EnergyAssetModel extends ChildProjectModel {
  projectSubtype?: FinancingSubtype;
  infrastructureType: InfrastructureType;
  energyOutput?: string;
  segment?: InfrastructureSegment;
  storageIncluded?: boolean;
  ppaContract?: boolean;
}

export interface FinancingModel extends ChildProjectModel {
  projectSubtype?: FinancingSubtype;
  amount?: number;
  dontDisclouse?: boolean;
  landAvailable?: boolean;
  activeType?: string;
}

export interface InfrastructureModel extends ChildProjectModel {
  infrastructureType: InfrastructureType;
  energyOutput?: string;
  segment?: InfrastructureSegment;
  landArea?: number;
}

export interface NaturalResourcesDevelopmentModel extends ChildProjectModel {
  energyOutput?: string;
  segment?: InfrastructureSegment;
  activeType?: string;
}

export interface NaturalResourcesFinancingModel extends ChildProjectModel {
  projectSubtype?: FinancingSubtype;
  activeType?: string;
}

export interface RealStateModel extends ChildProjectModel {
  landArea?: number;
  realStateType?: string;
  quantity?: number;
  sizeInAcres?: number;
  sizeInSqft?: number;
  totalPrice: number;
  pricePerAcre: number;
  suggestedUse: string;
  residentialSubType?: string;
  relationShipWithOwner?: string;
  ownersIntention: string;
  parcelId: string;
}
