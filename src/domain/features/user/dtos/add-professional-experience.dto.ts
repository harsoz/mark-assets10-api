import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProfessionalExperienceDTO {
  @IsString()
  @IsNotEmpty()
  company: string = '';

  @IsString()
  @IsNotEmpty()
  position: string = '';

  @IsInt()
  @Type(() => Number)
  countryId!: number;

  @IsString()
  @IsNotEmpty()
  activities: string = '';

  @IsDateString() 
  @IsNotEmpty()
  from!: Date;

  @IsDateString()
  @IsNotEmpty()
  to!: Date;
}