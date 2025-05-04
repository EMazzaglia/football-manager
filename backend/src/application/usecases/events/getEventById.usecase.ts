import { EventRepository } from "../../../domain/repositories/events.repository";
import { Service } from "typedi";

@Service()
export class GetEventByIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string) {
    return await this.eventRepository.getById(id);
  }
}
