import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { SchedulerService } from "./application/services/scheduler.service";

dotenv.config();

useContainer(Container);

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache the preflight response for 24 hours
};


const app = createExpressServer({
  controllers: [__dirname + "/api/controllers/*.ts"],
  middlewares: [__dirname + "/api/middlewares/*.ts"],
  defaultErrorHandler: false,
  classTransformer: true,
  cors: corsOptions,
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 3000;
    const schedulerService = Container.get(SchedulerService);
    schedulerService.start();

    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();  