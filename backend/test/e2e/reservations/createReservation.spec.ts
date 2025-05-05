import request from "supertest";
import { createExpressServer, useContainer } from "routing-controllers";
import mongoose from "mongoose";
import { Container } from "typedi";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ReservationController } from "../../../src/api/controllers/reservations.controller";
import { ReservationsRepository } from "../../../src/domain/repositories/reservations.repository";
import { GetUserReservationsUseCase } from "../../../src/application/usecases/reservations/getUserReservations.usecase";
import { Reservation } from "../../../src/domain/models/reservation";
import { Event } from "../../../src/domain/models/event";
import { PaginationMiddleware } from "../../../src/api/middlewares/pagination.middleware";
import { CreateReservationUseCase } from "../../../src/application/usecases/reservations/createReservation.usecase";
import { ExceptionHandlerMiddleware } from "../../../src/api/middlewares/exception.middleware";

describe("Reservation E2E Tests", () => {
    let server: any;
    let mongoServer: MongoMemoryServer;
    let app: any;
    let testEvents: Event[] = [];

    beforeAll(async () => {
        Container.reset();
        useContainer(Container);

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const reservationRepository = new ReservationsRepository();

        Container.set(ReservationsRepository, reservationRepository);
        Container.set(CreateReservationUseCase, new CreateReservationUseCase(reservationRepository));
        Container.set(GetUserReservationsUseCase, new GetUserReservationsUseCase(
            reservationRepository,
        ));
        Container.set(PaginationMiddleware, new PaginationMiddleware());
        Container.set(ReservationController, new ReservationController(
            Container.get(CreateReservationUseCase),
            Container.get(GetUserReservationsUseCase)
        ));

        app = createExpressServer({
            controllers: [ReservationController],
            middlewares: [PaginationMiddleware, ExceptionHandlerMiddleware],
            defaultErrorHandler: false,
            classTransformer: true,
        });

        server = app.listen(4003);

        // Seed test data - create events
        await Event.deleteMany({});
        testEvents = await Event.create([
            {
                eventId: "EBXSeZJP",
                date: new Date("2021-11-27"),
                country: "spain",
                homeTeam: "Barcelona",
                awayTeam: "Real Madrid",
                league: "SP1",
                price: 150,
                availableSeats: 50
            },
            {
                eventId: "EH6eLjN1",
                date: new Date("2021-11-28"),
                country: "england",
                homeTeam: "Manchester United",
                awayTeam: "Liverpool",
                league: "E0",
                price: 120,
                availableSeats: 5
            },
            {
                eventId: "EJ6eLkN2",
                date: new Date("2021-11-29"),
                country: "germany",
                homeTeam: "Bayern Munich",
                awayTeam: "Dortmund",
                league: "D1",
                price: 110,
                availableSeats: 20
            }
        ]);

        await Reservation.deleteMany({});
    });

    describe("POST /reservations - Create Reservation", () => {
        it("should successfully create a reservation", async () => {
            // Arrange
            const reservationData = {
                userId: "user123",
                eventId: "EBXSeZJP",
                spots: 2
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json');

            // Assert
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.userId).toBe(reservationData.userId);
            expect(res.body.eventId).toBe(reservationData.eventId);
            expect(res.body.spots).toBe(reservationData.spots);

            // check that the reservation was created in the database and availability was updated
            const updatedEvent = await Event.findOne({ eventId: reservationData.eventId });
            expect(updatedEvent?.availableSeats).toBe(48); // 50 - 2
        });

        it("should not create a reservation with more than 2 spots", async () => {
            // Arrange
            const reservationData = {
                userId: "user123",
                eventId: "EJ6eLkN2",
                spots: 3 // more than 2 spots
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .expect('Content-Type', /json/);

            // Assert
            expect(res.status).toBe(400); // this is caught by class validator
        });

        it("should not allow a user to reserve more than 5 spots total across events", async () => {
            // First create reservations that put the user at the 5-spot limit
            await Reservation.deleteMany({ userId: "testUser" });

            // 5 reservations for testUser
            await Reservation.create([
                {
                    userId: "testUser",
                    eventId: "EBXSeZJP",
                    spots: 2,
                },
                {
                    userId: "testUser",
                    eventId: "EJ6eLkN2",
                    spots: 2,
                },
                {
                    userId: "testUser",
                    eventId: "EH6eLjN1",
                    spots: 1,
                }
            ]);

            // Try to reserve one more spot
            const reservationData = {
                userId: "testUser",
                eventId: "EH6eLjN1", // Man Utd vs Liverpool
                spots: 1
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .expect('Content-Type', /json/);

            // Assert
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain(`User can't reserve more than 5 spots across all events`);
        }, 100000);

        it("should not allow a user to reserve more than 2 spots for the same event", async () => {
            // First create a reservation for 1 spot
            await Reservation.deleteMany({ userId: "newUser", eventId: "EJ6eLkN2" });

            await Reservation.create({
                userId: "newUser",
                eventId: "EJ6eLkN2",
                spots: 1,
            });

            // try to reserve 2 more spots (which would exceed the 2-spot limit)
            const reservationData = {
                userId: "newUser",
                eventId: "EJ6eLkN2", // same event
                spots: 2
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .expect('Content-Type', /json/);

            // Assert
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain(`User can't reserve more than 2 spots for the same event`);
        });

        it("should allow a user to reserve exactly 2 spots for the same event", async () => {
            // Create a new user for this test
            const userId = "exactUser";
            const eventId = "EJ6eLkN2"; // Bayern vs Dortmund

            await Reservation.deleteMany({ userId, eventId });

            // Try to reserve 2 spots
            const reservationData = {
                userId,
                eventId,
                spots: 2
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .expect('Content-Type', /json/);

            // Assert
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.spots).toBe(2);

            // Check that the reservation was created in the database
            const savedReservation = await Reservation.findOne({ userId, eventId });
            expect(savedReservation).not.toBeNull();
            expect(savedReservation?.spots).toBe(2);
        });

        it("should fail when trying to reserve for a non-existent event", async () => {
            const reservationData = {
                userId: "user123",
                eventId: "nonExistentEventId",
                spots: 1
            };

            // Act
            const res = await request(app)
                .post("/reservations")
                .send(reservationData)
                .expect('Content-Type', /json/);

            // Assert
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Event not found');
        });
    });

    afterAll(async () => {
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