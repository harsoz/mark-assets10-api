import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from 'src/domain/types/currency.type';
import { MeasureUnit } from 'src/domain/types/measure-unit.type';

export class ProjectDTO {

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  countryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stateId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cityId?: number;

  @IsString()
  title: string = '';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  removedFiles?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  sellingConditions?: string;

  @IsOptional()
  @IsString()
  sellingWindow?: string;

  @IsOptional()
  @IsString()
  restrictionsAndRequirements?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsEnum(Currency)
  currency: Currency = Currency.USD;

  @IsEnum(MeasureUnit)
  measureUnit: MeasureUnit = MeasureUnit.Sqft;
}