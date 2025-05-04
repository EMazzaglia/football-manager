import { JsonController, Post, Get, Body, Param, QueryParams } from "routing-controllers";
import { Inject } from "typedi";
import { CreateReservationDto } from "../dtos/createReservation.dto";
import { GetUserReservationsDto } from "../dtos/getUserReservation.dto";
import { CreateReservationUseCase } from "../../application/usecases/reservations/createReservation.usecase";
import { GetUserReservationsUseCase } from "../../application/usecases/reservations/getUserReservations.usecase";
import { Reservation } from "../../domain/models/reservation";
import { PaginateResult } from "mongoose";

@JsonController("/reservations")
export class ReservationController {
  constructor(
    @Inject() private createReservationUseCase: CreateReservationUseCase,
    @Inject() private getUserReservationsUseCase: GetUserReservationsUseCase
  ) {}

  @Post()
  async createReservation(@Body() data: CreateReservationDto): Promise<Reservation> {
    return this.createReservationUseCase.execute(data);
  }

  @Get("/user/:userId")
  async getUserReservations(
    @Param("userId") userId: string,
    @QueryParams() query: GetUserReservationsDto
  ): Promise<PaginateResult<Reservation>> {
    return this.getUserReservationsUseCase.execute(userId, query);
  }
}