import { ConsumeMessage } from 'amqplib';

const parseResponsePayload = <T = unknown>(response: ConsumeMessage): T => {
  const strPayload = response.content.toString();
  return JSON.parse(strPayload) as T;
};

export const RabbitMQUtils = {
  parseResponsePayload,
};
