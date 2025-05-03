import { GetEventByIdUseCase } from "../../../src/application/usecases/events/getEventById.usecase";
import { Event } from "../../../src/domain/models/event";
import { EventRepository } from "../../../src/domain/repositories/events.repository";

describe("GetEventByIdUseCase", () => {
  let getEventByIdUseCase: GetEventByIdUseCase;
  let eventRepository: EventRepository;

  beforeEach(() => {
    eventRepository = {
      getById: jest.fn(),
      search: jest.fn()
    }
    getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
  });

  it("should return an event by ID", async () => {
    //arrange
    const eventData = {
      eventId: "123",
      country: "USA",
      date: new Date(),
      homeTeam: "Team A",
    } as unknown as Event;
  
    jest.spyOn(eventRepository, "getById").mockResolvedValue(eventData);

    // act
    const result = await getEventByIdUseCase.execute("123");
    
    // assert
    expect(result).toEqual(eventData);
    expect(eventRepository.getById).toHaveBeenCalledWith("123");
  });
});