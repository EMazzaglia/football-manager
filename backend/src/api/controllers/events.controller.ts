import { GetEventByIdUseCase } from "../../application/usecases/events/getEventById.usecase";
import { SearchEventsUseCase } from "../../application/usecases/events/searchEvents.usecase";
import { JsonController, Get, Param, QueryParams } from "routing-controllers";
import { Inject } from "typedi";
import { SearchEventsDto } from "../dtos/searchEvent.dto";
import { Event } from "src/domain/models/event";
import { PaginateResult } from "mongoose";

@JsonController("/events")
export class EventController {
  constructor(
    @Inject() private getEventById: GetEventByIdUseCase,
    @Inject() private searchEvents: SearchEventsUseCase
  ) {}

  @Get("/:id")
  async getById(@Param("id") id: string): Promise<Event> {
    return this.getEventById.execute(id);
  }

  @Get()
  async search(@QueryParams() query: SearchEventsDto): Promise<PaginateResult<Event>> {
    return this.searchEvents.execute(query);
  }

}