import { Kafka, logLevel } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const brokerHost = process.env.KAFKA_BROKER_HOST;
const brokerPort = process.env.KAFKA_PORT;

const kafkaBroker = `${brokerHost}:${brokerPort}`;

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: [kafkaBroker],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./public/ca.pem"), "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};
