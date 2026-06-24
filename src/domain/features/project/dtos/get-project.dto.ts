import { IsOptional, IsString, IsInt, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from 'src/domain/types/project-status.type';
import { QueryParamsDTO } from '../../common/query-params.dto';

export class GetProjectDTO  extends QueryParamsDTO {
  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsInt()
  isActive?: Boolean;

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

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  landArea?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minLandArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxLandArea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSizeInAcres?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSizeInAcres?: number;

  @IsOptional()
  @IsString()
  relationShipWithOwner?: string;

  @IsOptional()
  @IsString()
  ownersIntention?: string = '';

  @IsOptional()
  @IsString()
  suggestedUse?: string = '';

  @IsOptional()
  @IsString()
  landAvailable?: string;

  @IsOptional()
  @IsString()
  segment?: string;

  @IsOptional()
  @IsString()
  storageIncluded?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  ppaContract?: string;
}