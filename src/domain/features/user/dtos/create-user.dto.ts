import { IsString, IsEmail, IsOptional, IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { ProfileType } from 'src/domain/types/profile.type';
import { UserStatus } from 'src/domain/types/user-status.type';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus = UserStatus.Inactive;

  @IsString()
  @IsOptional()
  phoneNumber: string = '';

  @IsString()
  @IsOptional()
  address: string = '';

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
  education?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  webPage?: string;

  // Nota: IFormFile no va en el DTO, se maneja como Express.Multer.File 
  // en el controlador mediante decoradores @UploadedFile()

  @IsString()
  @IsNotEmpty()
  roles!: string;

  @IsString()
  @IsOptional()
  jsonData?: string;

  @IsEnum(ProfileType)
  @IsOptional()
  dynamicFieldProfile?: ProfileType;
}