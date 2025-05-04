import { Service } from "typedi";
import { CreateReservationDto } from "../../../api/dtos/createReservation.dto";
import { ReservationsRepository } from "../../../domain/repositories/reservations.repository";
import { Reservation } from "../../../domain/models/reservation";

@Service()
export class CreateReservationUseCase {
  constructor(private reservationsRepository: ReservationsRepository) {}

  async execute(data: CreateReservationDto): Promise<Reservation> {
    return this.reservationsRepository.createReservation(data);
  }
}