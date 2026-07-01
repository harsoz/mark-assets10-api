import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt } from 'class-validator';
import { LanguageType } from 'src/domain/types/language.type';
import { UserStatus } from 'src/domain/types/user-status.type';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus = UserStatus.Inactive;

  @IsString()
  @IsOptional()
  phoneNumber?: string = '';

  @IsString()
  @IsOptional()
  address?: string = '';

  @IsInt()
  @IsOptional()
  countryId?: number;

  @IsInt()
  @IsOptional()
  stateId?: number;

  @IsInt()
  @IsOptional()
  cityId?: number;

  @IsString()
  @IsOptional()
  xSocial?: string;

  @IsString()
  @IsOptional()
  linkedIn?: string;

  @IsString()
  @IsOptional()
  aboutMe?: string;

  @IsString()
  @IsNotEmpty()
  roles!: string;

  @IsString()
  @IsOptional()
  jsonData?: string;

  @IsEnum(LanguageType)
  @IsOptional()
  language?: LanguageType;
}