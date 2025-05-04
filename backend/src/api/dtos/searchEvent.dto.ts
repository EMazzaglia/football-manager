import { IsOptional, IsString, IsDateString } from "class-validator";
import { PaginationDto } from "./pagination.dto";

export class SearchEventsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  homeTeam?: string;

  @IsOptional()
  @IsString()
  awayTeam?: string;

  @IsOptional()
  @IsString()
  team?: string;
}