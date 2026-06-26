import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CreateAssetDTO, CreateConsultingArchitectureDTO, UpdateAssetDTO, UpdateConsultingArchitectureDTO } from './create-and-update-group.dto';
import { Type } from 'class-transformer';

export class UpdateDTO {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAssetDTO)
  Asset?: UpdateAssetDTO;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateConsultingArchitectureDTO)
  ConsultingArchitecture?: UpdateConsultingArchitectureDTO;
}
