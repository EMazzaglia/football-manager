import { Service } from "typedi";
import { Event } from "../models/event";
import { PaginateResult } from "mongoose";
import { Reservation } from "../models/reservation";
import { GetUserReservationsDto } from "../../api/dtos/getUserReservation.dto";
import { BadRequestException, NotFoundException, UnprocessableEntityException } from "../../api/exceptions/httpExceptions";

@Service()
export class ReservationsRepository {
  async createReservation(reservationData: {
    userId: string;
    eventId: string;
    spots: number;
  }): Promise<Reservation> {
    // this should be done using transactions. I cant configure transactions for the tests 
    const event = await Event.findOne({ eventId: reservationData.eventId });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.availableSeats < reservationData.spots) {
      throw new UnprocessableEntityException(
        "Not enough available seats for this event")
    }

    const existingReservations = await Reservation.find({
      userId: reservationData.userId,
      status: { $ne: 'cancelled' }
    });

    const totalReservedSpots = existingReservations.reduce(
      (total, reservation) => total + reservation.spots, 0
    );

    if (totalReservedSpots + reservationData.spots > 5) {
      throw new UnprocessableEntityException(
        "User can't reserve more than 5 spots across all events"
      );
    }

    const eventReservations = existingReservations.filter(
      r => r.eventId === reservationData.eventId
    );

    const spotsForThisEvent = eventReservations.reduce(
      (total, reservation) => total + reservation.spots, 0
    );

    if (spotsForThisEvent + reservationData.spots > 2) {
      throw new UnprocessableEntityException(
        "User can't reserve more than 2 spots for the same event")
    }

    // persist the reservation
    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();
    event.availableSeats -= reservationData.spots;
    // I shouldn't be updating the event here, it should be done in the events repository
    // exposing a method to update the event cause I am breaking the module boundaries 
    await event.save();
    return savedReservation.toJSON();
  }

  async getUserReservationsWithPagination(
    userId: Reservation["userId"],
    queryParams: GetUserReservationsDto
  ): Promise<PaginateResult<Reservation>> {
    const { page, limit, sort } = queryParams;

    const options = {
      page,
      limit,
      lean: true,
      sort,
      customLabels: {
        docs: 'items',
        totalDocs: 'totalItems'
      }
    };

    return await Reservation.paginate({ userId }, options);
  }
}