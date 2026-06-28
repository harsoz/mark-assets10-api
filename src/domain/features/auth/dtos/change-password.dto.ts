import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(6)
  confirmPassword!: string;
}