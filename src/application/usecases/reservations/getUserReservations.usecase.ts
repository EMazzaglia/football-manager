import { Service } from "typedi";
import { PaginateResult } from "mongoose";
import { Reservation } from "../../../domain/models/reservation";
import { GetUserReservationsDto } from "../../../api/dtos/getUserReservation.dto";
import { ReservationsRepository } from "../../../domain/repositories/reservations.repository";

@Service()
export class GetUserReservationsUseCase {
    constructor(
        private reservationsRepository: ReservationsRepository,
    ) { }

    async execute(userId: string, query: GetUserReservationsDto): Promise<PaginateResult<Reservation>> {
        return this.reservationsRepository.getUserReservationsWithPagination(
            userId,
            query
        );
    }
}