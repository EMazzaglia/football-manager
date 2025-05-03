import request from "supertest";
import { createExpressServer, useContainer } from "routing-controllers";
import mongoose from "mongoose";
import { Container } from "typedi";
import { MongoMemoryServer } from "mongodb-memory-server";
import { EventController } from "../../../src/api/controllers/events.controller";
import { GetEventByIdUseCase } from "../../../src/application/usecases/events/getEventById.usecase";
import { EventRepository } from "../../../src/domain/repositories/events.repository";
import { SearchEventsUseCase } from "../../../src/application/usecases/events/searchEvents.usecase";
import { Event } from "../../../src/domain/models/event";
import { ExceptionHandlerMiddleware } from "../../../src/api/middlewares/exception.middleware"; 

describe("EventController E2E Tests", () => {
  let server: any;
  let mongoServer: MongoMemoryServer;
  let app: any;
  let testEvents: any[] = [];

  beforeAll(async () => {
    Container.reset();
    useContainer(Container);

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const eventRepository = new EventRepository();
    Container.set(EventRepository, eventRepository);
    Container.set(GetEventByIdUseCase, new GetEventByIdUseCase(eventRepository));
    Container.set(SearchEventsUseCase, new SearchEventsUseCase(eventRepository));

    Container.set(EventController, new EventController(
      Container.get(GetEventByIdUseCase),
      Container.get(SearchEventsUseCase)
    ));
    app = createExpressServer({
      controllers: [EventController],
      middlewares: [ExceptionHandlerMiddleware],
      defaultErrorHandler: false,
      classTransformer: true,
    });

    server = app.listen(4001);

    // Seed test data
    await Event.deleteMany({});
    testEvents = await Event.create([
      {
        eventId: "EBXSeZJP",
        date: new Date("2021-11-27"),
        country: "spain",
        homeTeam: "Levante",
        awayTeam: "Sporting Gijon",
        league: "SP1",
        price: 112,
        availableSeats: 27982
      },
      {
        eventId: "EH6eLjN1",
        date: new Date("2021-11-27"),
        country: "england",
        homeTeam: "Swansea",
        awayTeam: "Aston Villa",
        league: "E0",
        price: 119,
        availableSeats: 26693
      },
      {
        eventId: "EJ6eLkN2",
        date: new Date("2021-11-27"),
        country: "spain",
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        league: "SP1",
        price: 150,
        availableSeats: 50000
      },
      {
        eventId: "EJ6eLkN3",
        date: new Date("2021-11-28"),
        country: "england",
        homeTeam: "Liverpool",
        awayTeam: "Manchester City",
        league: "E0",
        price: 200,
        availableSeats: 54000
      }
    ]);
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe("GET /events/:id - Get Event By ID", () => {
    it("should successfully get an event by ID", async () => {
      // arrange
      const event = testEvents[0];
      const eventId = event.eventId;

      // act
      const res = await request(app)
        .get(`/events/${eventId}`)

      // assert
      expect(res.status).toBe(200);
      const eventData = res.body;
      expect(eventData.eventId).toBe(event.eventId);
      expect(eventData.country).toBe(event.country);
      expect(eventData.homeTeam).toBe(event.homeTeam);
      expect(eventData.awayTeam).toBe(event.awayTeam);
      expect(eventData.league).toBe(event.league);
      expect(eventData.price).toBe(event.price);
      expect(eventData.availableSeats).toBe(event.availableSeats);
      const expectedDatePrefix = event.date.toISOString().split('T')[0];
      const actualDatePrefix = new Date(eventData.date).toISOString().split('T')[0];
      expect(actualDatePrefix).toBe(expectedDatePrefix);
    }, 10000); // 10 second timeout for this test

    // TODO: IMPLEMENT ERROR CASES EXCEPTION HANDLING

  });
});