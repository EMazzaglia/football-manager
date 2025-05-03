import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

useContainer(Container);

const app = createExpressServer({
  controllers: [__dirname + "/api/controllers/*.ts"],
  middlewares: [__dirname + "/api/middlewares/*.ts"],
  defaultErrorHandler: false,
  classTransformer: true,
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();  