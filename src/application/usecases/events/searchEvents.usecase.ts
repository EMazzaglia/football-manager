import { Event } from "src/domain/models/event";
import { EventRepository } from "../../../domain/repositories/events.repository";
import { Service } from "typedi";
import { SearchEventsDto } from "src/api/dtos/searchEvent.dto";
import { PaginateResult } from "mongoose";

@Service()
export class SearchEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(params: SearchEventsDto): Promise<PaginateResult<Event>> {
    return this.eventRepository.search(params);
  }
}