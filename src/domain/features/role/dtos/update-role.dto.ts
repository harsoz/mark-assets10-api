import { IsString, IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class UpdateRoleDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  permissions!: string[];
}