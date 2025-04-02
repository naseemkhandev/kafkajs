import { consumer, producer } from "../config/kafka.config.js";

export const produceMessage = async (topic: string, message: string) => {
  try {
    const result = await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log("Message produced:", result);
  } catch (error) {
    console.error("Error producing message:", error);
    throw new Error("Failed to produce message");
  }
};

export const consumeMessage = async (topic: string) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error("Error consuming message:", error);
    throw new Error("Failed to consume message");
  }
};
