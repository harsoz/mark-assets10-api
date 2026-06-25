import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CreateAssetDTO, CreateConsultingArchitectureDTO } from './create-group.dto';
import { Type } from 'class-transformer';

export class CreateDTO {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssetDTO)
  Asset?: CreateAssetDTO;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateConsultingArchitectureDTO)
  ConsultingArchitecture?: CreateConsultingArchitectureDTO;
}
