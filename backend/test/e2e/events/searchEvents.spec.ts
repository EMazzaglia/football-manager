import request from "supertest";
import { createExpressServer, useContainer } from "routing-controllers";
import mongoose from "mongoose";
import { Container } from "typedi";
import { EventController } from "../../../src/api/controllers/events.controller";
import { MongoMemoryServer } from "mongodb-memory-server";
import { GetEventByIdUseCase } from "../../../src/application/usecases/events/getEventById.usecase";
import { EventRepository } from "../../../src/domain/repositories/events.repository";
import { SearchEventsUseCase } from "../../../src/application/usecases/events/searchEvents.usecase";
import { Event } from "../../../src/domain/models/event";
import { PaginationMiddleware } from "../../../src/api/middlewares/pagination.middleware";
import { ExceptionHandlerMiddleware } from "../../../src/api/middlewares/exception.middleware";

describe("Search Events E2E Tests", () => {
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
    Container.set(PaginationMiddleware, new PaginationMiddleware());
    Container.set(EventController, new EventController(
      Container.get(GetEventByIdUseCase),
      Container.get(SearchEventsUseCase)
    ));

    app = createExpressServer({
      controllers: [EventController],
      middlewares: [PaginationMiddleware, ExceptionHandlerMiddleware],
      defaultErrorHandler: false,
      classTransformer: true,
    });
    server = app.listen(4002);
    await Event.deleteMany({});
    //seed
    testEvents = await Event.create([
      {
        eventId: "EBXSeZJP",
        date: new Date("2021-11-27"),
        country: "spain",
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        league: "SP1",
        price: 150,
        availableSeats: 50000
      },
      {
        eventId: "EH6eLjN1",
        date: new Date("2021-11-27"),
        country: "england",
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        league: "E0",
        price: 120,
        availableSeats: 45000
      },
      {
        eventId: "fDkek936",
        date: new Date("2021-11-28"),
        country: "italy",
        homeTeam: "Juventus",
        awayTeam: "AC Milan",
        league: "I1",
        price: 100,
        availableSeats: 40000
      },
      {
        eventId: "GrABOTJT",
        date: new Date("2021-11-28"),
        country: "france",
        homeTeam: "PSG",
        awayTeam: "Lyon",
        league: "F1",
        price: 90,
        availableSeats: 35000
      },
      {
        eventId: "hOwmZVRI",
        date: new Date("2021-11-29"),
        country: "germany",
        homeTeam: "Bayern Munich",
        awayTeam: "Dortmund",
        league: "D1",
        price: 110,
        availableSeats: 48000
      },
      {
        eventId: "KLmn7890",
        date: new Date("2021-11-29"),
        country: "spain",
        homeTeam: "Atletico Madrid",
        awayTeam: "Sevilla",
        league: "SP1",
        price: 95,
        availableSeats: 30000
      }
    ]);
  });

  describe("GET /events - Search Events", () => {
    it("should return all events when no search parameters provided", async () => {
      const res = await request(app)
        .get("/events")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(testEvents.length);
      expect(res.body.totalItems).toBe(testEvents.length);
    });

    it("should search events by country", async () => {
      // act
      const res = await request(app)
        .get("/events?country=spain")
        .expect('Content-Type', /json/);

      //assert
      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);
      res.body.items.forEach((event: any) => {
        expect(event.country.toLowerCase()).toBe('spain');
      });
    });

    it("should search events by date", async () => {
      const res = await request(app)
        .get("/events?date=2021-11-28")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);
      res.body.items.forEach((event: any) => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        expect(eventDate).toBe('2021-11-28');
      });
    });

    it("should search events by home team", async () => {
      const res = await request(app)
        .get("/events?homeTeam=Barcelona")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);
      expect(res.body.items[0].homeTeam).toBe('Barcelona');
    });

    it("should search events by away team", async () => {
      const res = await request(app)
        .get("/events?awayTeam=Liverpool")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);

      // Should return exactly 1 event
      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);

      // Verify it's the correct team
      expect(res.body.items[0].awayTeam).toBe('Liverpool');
    });

    it("should search events by team (matches either home or away)", async () => {
      const res = await request(app)
        .get("/events?team=Real Madrid")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);

      // Should return events with "Real Madrid" in either home or away team 1 in my sample data
      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);
      res.body.items.forEach((event: any) => {
        const hasTeam =
          event.homeTeam.includes('Real Madrid') ||
          event.awayTeam.includes('Real Madrid');
        expect(hasTeam).toBe(true);
      });
    });

    it("should support pagination with page and limit parameters", async () => {
      // Request page 1 with limit of 2
      const res1 = await request(app)
        .get("/events?page=1&limit=2")
        .expect('Content-Type', /json/);

      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('items');
      expect(Array.isArray(res1.body.items)).toBe(true);
      expect(res1.body.items.length).toBe(2);
      expect(res1.body.totalItems).toBe(testEvents.length);
      expect(res1.body.page).toBe(1);
      expect(res1.body.limit).toBe(2);

      // Request page 2 with limit of 2
      const res2 = await request(app)
        .get("/events?page=2&limit=2")
        .expect('Content-Type', /json/);

      expect(res2.status).toBe(200);
      expect(res2.body).toHaveProperty('items');
      expect(Array.isArray(res2.body.items)).toBe(true);
      expect(res2.body.items.length).toBe(2);
      expect(res2.body.page).toBe(2);

      // Verify first and second page events are different
      const firstPageIds = res1.body.items.map((e: any) => e.eventId);
      const secondPageIds = res2.body.items.map((e: any) => e.eventId);

      expect(firstPageIds).not.toEqual(expect.arrayContaining(secondPageIds));
    });

    it("should handle complex search with multiple parameters", async () => {
      // Search for Spanish events with "Madrid" in team name on November 27
      const res = await request(app)
        .get("/events?country=spain&team=Madrid&date=2021-11-27")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);

      // Should return exactly 1 event matching all criteria
      expect(res.body.items.length).toBe(1);
      expect(res.body.totalItems).toBe(1);

      // Verify all criteria are met
      const event = res.body.items[0];
      expect(event.country.toLowerCase()).toBe('spain');
      expect(new Date(event.date).toISOString().split('T')[0]).toBe('2021-11-27');

      const hasTeam =
        event.homeTeam.includes('Madrid') ||
        event.awayTeam.includes('Madrid');
      expect(hasTeam).toBe(true);
    });

    it("should return empty results for non-matching search", async () => {
      const res = await request(app)
        .get("/events?country=brazil")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);

      // Should return no events
      expect(res.body.items.length).toBe(0);
      expect(res.body.totalItems).toBe(0);
    });

    it("should be case-insensitive for searches", async () => {
      const res = await request(app)
        .get("/events?country=SPAIN")
        .expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);

      // Should still find Spanish events despite case difference
      expect(res.body.items.length).toBe(2);
      expect(res.body.totalItems).toBe(2);

      // Check all events are from Spain
      res.body.items.forEach((event: any) => {
        expect(event.country.toLowerCase()).toBe('spain');
      });
    });
  });

  afterAll(async () => {
    // Clean up test resources
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }

    if (mongoose.connection) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }
  });
});