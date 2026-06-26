import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateFieldDTO {
  
  @IsString()
  @IsNotEmpty()
  profile: string = '';

  @IsString()
  @IsNotEmpty()
  jsonData: string = '';
}