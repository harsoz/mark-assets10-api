import {
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType } from 'src/domain/types/asset.type';
import { DevelopmentSubtype } from 'src/domain/types/development-subtype.type';
import { ServiceType } from 'src/domain/types/service.type';
import { ProjectDTO } from './project.dto';
import { FinancingSubtype } from 'src/domain/types/financing-subtype.type';
import { InfrastructureType } from 'src/domain/types/infrastructure.type';
import { InfrastructureSegment } from 'src/domain/types/infrastructure-segment.type';

// we might split this in the future
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

// just change the name to update, according to the legacy code
export class UpdateAssetDTO extends CreateAssetDTO {}

export class CreateConsultingArchitectureDTO extends ProjectDTO {
  @IsOptional()
  @IsEnum(DevelopmentSubtype)
  projectSubtype?: DevelopmentSubtype;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsBoolean()
  landAvailable?: boolean;
}

export class UpdateConsultingArchitectureDTO extends CreateConsultingArchitectureDTO {}

export class CreateDevelopmentDTO extends ProjectDTO {
  @IsOptional()
  @IsEnum(DevelopmentSubtype)
  projectSubtype?: DevelopmentSubtype;

  @IsOptional()
  @IsBoolean()
  landAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  landArea?: number;

  @IsOptional()
  @IsString()
  activeType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;
}

export class UpdateDevelopmentDTO extends CreateDevelopmentDTO {}

export class CreateEnergyAssetDTO extends ProjectDTO {
  
  @IsOptional()
  @IsEnum(FinancingSubtype)
  projectSubtype?: FinancingSubtype;

  @IsEnum(InfrastructureType)
  infrastructureType!: InfrastructureType;

  @IsOptional()
  @IsString()
  energyOutput?: string;

  @IsOptional()
  @IsEnum(InfrastructureSegment)
  segment?: InfrastructureSegment;

  @IsOptional()
  @IsBoolean()
  storageIncluded?: boolean;

  @IsOptional()
  @IsBoolean()
  ppaContract?: boolean;
}
export class UpdateEnergyAssetDTO extends CreateEnergyAssetDTO {}

export class CreateFinancingDTO extends ProjectDTO {
  
  @IsOptional()
  @IsEnum(FinancingSubtype)
  projectSubtype?: FinancingSubtype;

  @IsOptional()
  @Type(() => Number) 
  @IsInt()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsBoolean()
  dontDisclouse?: boolean; 

  @IsOptional()
  @IsBoolean()
  landAvailable?: boolean;

  @IsOptional()
  @IsString()
  activeType?: string;
}
export class UpdateFinancingDTO extends CreateFinancingDTO {}

export class CreateInfrastructureDTO extends ProjectDTO {
  
  @IsEnum(InfrastructureType)
  infrastructureType!: InfrastructureType;

  @IsOptional()
  @IsString()
  energyOutput?: string;

  @IsOptional()
  @IsEnum(InfrastructureSegment)
  segment?: InfrastructureSegment;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  landArea?: number;
}
export class UpdateInfrastructureDTO extends CreateInfrastructureDTO {}

export class CreateNaturalResourcesDevelopmentDTO extends ProjectDTO {
  
  @IsOptional()
  @IsString()
  energyOutput?: string;

  @IsOptional()
  @IsEnum(InfrastructureSegment)
  segment?: InfrastructureSegment;

  @IsOptional()
  @IsString()
  activeType?: string;
}
export class UpdateNaturalResourcesDevelopmentDTO extends CreateNaturalResourcesDevelopmentDTO {}

export class CreateNaturalResourcesFinancingDTO extends ProjectDTO {

  @IsOptional()
  @IsEnum(FinancingSubtype)
  projectSubtype?: FinancingSubtype;

  @IsOptional()
  @IsString()
  activeType?: string;
}
export class UpdateNaturalResourcesFinancingDTO extends CreateNaturalResourcesFinancingDTO {}

export class CreateRealStateDTO extends ProjectDTO {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  landArea?: number;

  @IsOptional()
  @IsString()
  realStateType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sizeInAcres?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sizeInSqft?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerAcre!: number;

  @IsString()
  suggestedUse!: string;

  @IsOptional()
  @IsString()
  residentialSubType?: string;

  @IsOptional()
  @IsString()
  relationShipWithOwner?: string;

  @IsString()
  ownersIntention!: string;

  @IsString()
  parcelId: string = '';
}

export class UpdateRealStateDTO extends CreateRealStateDTO {}