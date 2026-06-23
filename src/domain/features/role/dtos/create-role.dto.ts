import { IsString, IsBoolean, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsBoolean()
  isAdmin?: boolean;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0) 
  permissions?: string[];
}