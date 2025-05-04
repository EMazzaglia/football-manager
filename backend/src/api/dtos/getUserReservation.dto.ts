import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "./pagination.dto";

export class GetUserReservationsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: 'pending' | 'confirmed' | 'cancelled'; // best would be enum but for simplicity using string
}