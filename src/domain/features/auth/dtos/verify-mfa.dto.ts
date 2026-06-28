import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyMfaDTO {
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido' })
  token!: string; 
  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  code!: string;  

  @IsString()
  @IsOptional()
  deviceId?: string;
}