const { Kafka } = require("kafkajs");
const fs = require("fs");
const prismaClient = require("./prisma");
const path = require("path");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [
    "realtime-chatapp-kafka-vinayakvispute4-1688.a.aivencloud.com:12540",
  ],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./services/ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_YpW0MYya388sYqKnhpl",
    mechanism: "plain",
  },
});

let producer = null;

const createProducer = async () => {
  if (producer) return producer;

  producer = kafka.producer();
  await producer.connect();

  return producer;
};

const produceMessage = async (message) => {
  const producer = await createProducer();
  await producer.send({
    topic: "MESSAGES",
    messages: [{ key: `message-${Date.now()}`, value: message }],
  });

  console.log("Message sent to Kafka", message);
  return true;
};

const startMessageConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "default" });

  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;

      const messageData = JSON.parse(message.value.toString());
      const {
        roomId,
        author,
        message: messageContent,
        timeStamp,
      } = messageData;

      console.log({ roomId, author, message: messageContent, timeStamp });

      try {
        console.log("Saving message to the database");
        await prismaClient.message.create({
          data: {
            roomId,
            author,
            message: messageContent,
            timestamp: timeStamp,
          },
        });
      } catch (error) {
        console.log("Error in saving message to the database", error);
        pause();

        setTimeout(() => {
          consumer.resume({ topic: "MESSAGES" });
        }, 1000 * 60); // 1000 means 1 sec and 60 means 1 min
      }
    },
  });
};

module.exports = { kafka, produceMessage, startMessageConsumer };
