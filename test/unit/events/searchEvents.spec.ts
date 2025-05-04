import { EventRepository } from "../../../src/domain/repositories/events.repository";
import { SearchEventsUseCase } from "../../../src/application/usecases/events/searchEvents.usecase";

jest.mock("../../../src/domain/repositories/events.repository");

describe("SearchEventsUseCase", () => {
  let searchEventsUseCase: SearchEventsUseCase;
  let eventRepository: EventRepository;

  beforeEach(() => {
    eventRepository = {
      getById: jest.fn(),
      search: jest.fn()
    } as EventRepository;

    searchEventsUseCase = new SearchEventsUseCase(eventRepository);
  });

  it("should search events by country", async () => {
    const paginatedResult = {
      items: [
        {
          country: "Spain",
          date: new Date(),
          homeTeam: "FC Barcelona",
        },
        {
          country: "Spain",
          date: new Date(),
          homeTeam: "Real Madrid",
        }
      ],
      totalItems: 2,
      limit: 10,
      page: 1,
      totalPages: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    };
    
    jest.spyOn(eventRepository, "search").mockResolvedValue(paginatedResult as any);

    const query = { country: "Spain" };
    const result = await searchEventsUseCase.execute(query);
    
    expect(result).toEqual(paginatedResult);
    expect(eventRepository.search).toHaveBeenCalledWith(query);
  });

  // TODO add more unit tests
});