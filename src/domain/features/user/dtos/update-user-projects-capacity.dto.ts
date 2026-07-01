import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateUserProjectsCapacityDTO {
  @IsInt()
  @IsOptional()
  @Min(0) 
  newCapacity!: number;
}