import { IsNotEmpty, IsString, IsInt, Min, Max } from "class-validator";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  eventId!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2)
  spots!: number;
}