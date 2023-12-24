const { Kafka } = require("kafkajs");
const fs = require("fs");
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

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;

  return _producer;
};

const produceMessage = async (message) => {
  const producer = await createProducer();
  await producer.send({
    topic: "MESSAGES",
    messages: [{ key: `message-${Date.now()}`, value: message }],
  });
  console.log("Message Send to kafka", message);
  return true;
};

module.exports = { kafka, produceMessage };
