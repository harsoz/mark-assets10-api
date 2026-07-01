import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class AddEducationDTO {
  @IsString()
  @IsNotEmpty()
  institution: string = '';

  @IsString()
  @IsNotEmpty()
  certificationName: string = '';

  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  @IsNotEmpty()
  institutionCertifies: string = '';

  @IsDateString()
  @IsNotEmpty()
  certificationYear!: Date;

  @IsDateString()
  @IsNotEmpty()
  from!: Date;

  @IsDateString()
  @IsNotEmpty()
  to!: Date;
}