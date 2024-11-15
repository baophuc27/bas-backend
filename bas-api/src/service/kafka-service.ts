import { APP_NAME, KAFKA_HOST } from '@bas/config';
import { Kafka, Consumer } from 'kafkajs';
import { logError } from '@bas/utils';

const kafkaClient = new Kafka({
  clientId: `bas-client`,
  brokers: [KAFKA_HOST],
  retry: {
    initialRetryTime: 5000,
    retries: 20,
  },
});

const producer = kafkaClient.producer({
  allowAutoTopicCreation: true,
});

const initKafkaData = async (receiveMessage: Function, consumer: Consumer, topic: string) => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: APP_NAME == 'uat' ? `${topic}_uat` : topic,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message, topic: string }) => {
        // console.log(`[${topic}] Receive message ${message?.value?.toString()}`);
        receiveMessage(message);
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const produceKafkaData = async (topic: string, messages: string) => {
  try {
    await producer.connect();
    await producer.send({
      topic: APP_NAME == 'uat' ? `${topic}_uat` : topic,
      messages: [{ value: messages }],
    });
    await producer.disconnect();
  } catch (error) {
    logError(error);
  }
};

const healthCheck = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'health-check',
      messages: [{ value: 'health-check' }],
    });
    await producer.disconnect();
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export { initKafkaData, kafkaClient, produceKafkaData, healthCheck };
