import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { connectKafkaProducer } from "./config/kafka.config.js";
import { consumeMessage, produceMessage } from "./helpers/index.js";

const PORT = process.env.PORT || 8080;
const app: Application = express();

// * Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// * Routes
app.get("/", (req: Request, res: Response) => {
  return res.send("<h1>Server is Running 🚀</h1>");
});

app.post("/produce-message", async (req: Request, res: Response) => {
  try {
    const message = (req.body.message || "Hello, Kafka!") as string;
    const topic = process.env.KAFKA_TOPIC as string;
    await produceMessage(topic, message);

    return res.status(200).send("Message produced successfully");
  } catch (error) {
    console.error("Error consuming message", error);
    return res.status(500).send("Error consuming message");
  }
});

// * Kafka Producer
connectKafkaProducer().catch((error) => {
  console.error("Error connecting Kafka Producer", error);
});

// * Kafka Consumer
consumeMessage(process.env.KAFKA_TOPIC as string).catch((error) => {
  console.error("Error consuming message", error);
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
