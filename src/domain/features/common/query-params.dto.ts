import { IsInt, IsOptional, IsString, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamsDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;

  isPaginated(): boolean {
    return (this.page ?? 0) > 0 && (this.pageSize ?? 0) > 0;
  }

  shouldSearchByDate(): boolean {
    return !!this.fromDate && !!this.toDate;
  }
}