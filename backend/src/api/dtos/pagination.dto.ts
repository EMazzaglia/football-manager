import { IsOptional, IsString, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  static readonly MAX_LIMIT: number = 100;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = "date";

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';
}