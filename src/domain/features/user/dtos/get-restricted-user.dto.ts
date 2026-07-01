import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryParamsDTO } from '../../common/query-params.dto'; // Asegúrate de importar el padre
import { ProfileType } from 'src/domain/types/profile.type';

export class GetRestrictedUserDTO extends QueryParamsDTO {
  @IsOptional()
  @IsString()
  roles?: string;

  @IsOptional()
  @IsEnum(ProfileType)
  profileType?: ProfileType
}