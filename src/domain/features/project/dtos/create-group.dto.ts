import { IsEnum, IsOptional, IsInt, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType } from 'src/domain/types/asset.type';
import { DevelopmentSubtype } from 'src/domain/types/development-subtype.type';
import { ServiceType } from 'src/domain/types/service.type';
import { ProjectDTO } from './project.dto';

export class CreateAssetDTO extends ProjectDTO {
  
  @IsEnum(AssetType)
  assetType: AssetType = AssetType.House;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  landArea?: number;

  @IsOptional()
  @IsString()
  capRate?: string;
}

export class CreateConsultingArchitectureDTO extends ProjectDTO {
  
  @IsOptional()
  @IsEnum(DevelopmentSubtype)
  projectSubtype?: DevelopmentSubtype;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsString()
  landAvailable?: string;
}