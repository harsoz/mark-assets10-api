import { Currency } from "../types/currency.type";
import { MeasureUnit } from "../types/measure-unit.type";
import { ProjectStatus } from "../types/project-status.type";
import { ProjectType } from "../types/project.type";
import { CityModel, CountryModel, StateModel } from "./location.model";
import { ProjectFileModel } from "./project.model";
import { UserModel } from "./user.model";

export interface ProjectRecordModel {
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

  // to handle this in query 
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