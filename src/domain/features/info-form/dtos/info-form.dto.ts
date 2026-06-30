import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InfoFormDTO {
  @IsString()
  @IsOptional()
  message: string = '';

  @IsNotEmpty()
  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsNotEmpty()
  @IsString()
  customerName!: string;
}
