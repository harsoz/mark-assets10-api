import { IsEmail, IsOptional, IsString } from "class-validator";

export class InfoFormDTO {
  
  @IsString()
  @IsOptional()
  message: string = '';

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}