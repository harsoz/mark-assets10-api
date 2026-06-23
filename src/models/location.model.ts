import type { BaseModel, LocationModel as BaseLocationModel } from './base.model';

export interface CountryModel extends BaseLocationModel {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phoneCode: string;
  numericCode: string;
  capital: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  tld: string;
  nationality: string;
  emoji: string;
  emojiU: string;
  flag: string;
  native?: string;
  region?: string;
  subRegion?: string;
  wikiDataId?: string;
  timezones: string;
  translations: string;
  regionId?: number;
  regionData?: RegionModel;
  subRegionId?: number;
  subRegionData?: SubRegionModel;
  states?: StateModel[];
}

export interface StateModel extends BaseLocationModel {
  id: number;
  name: string;
  countryCode: string;
  iso2: string;
  flag: number;
  fipsCode?: string;
  type?: string;
  wikiDataId?: string;
  countryId: number;
  country?: CountryModel;
  cities?: CityModel[];
}

export interface CityModel extends BaseLocationModel {
  id: number;
  name: string;
  stateCode: string;
  countryId: number;
  countryCode: string;
  flag: number;
  wikiDataId?: string;
  stateId: number;
  state?: StateModel;
}

export interface RegionModel extends BaseModel {
  name: string;
  translations: string;
  flag: string;
  wikiDataId?: string;
  subRegions?: SubRegionModel[];
}

export interface SubRegionModel extends BaseModel {
  name: string;
  translations: string;
  flag: string;
  wikiDataId?: string;
  regionId: number;
  region?: RegionModel;
}
