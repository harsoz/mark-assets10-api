import { IsOptional, IsString } from 'class-validator';
import { QueryParamsDTO } from '../../common/query-params.dto'; // Asegúrate de importar el padre

export class GetRestrictedUserDTO extends QueryParamsDTO {
  @IsOptional()
  @IsString()
  roles?: string;
}