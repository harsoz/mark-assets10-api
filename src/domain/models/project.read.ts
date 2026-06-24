import { ProjectStatus } from "src/domain/types/project-status.type";
import { BaseModel } from "./base.model";
import { Currency } from "src/domain/types/currency.type";
import { MeasureUnit } from "src/domain/types/measure-unit.type";
import { ProjectType } from "src/domain/types/project.type";
import { CityModel, CountryModel, StateModel } from "./location.model";
import { UserModel } from "./user.model";
import { ProjectFileModel } from "./project.model";

export interface ProjectReadModel extends BaseModel {
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
  details: any; // any for now
}