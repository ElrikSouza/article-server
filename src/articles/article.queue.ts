import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import ChannelWrapper from 'amqp-connection-manager/dist/types/ChannelWrapper';

@Injectable()
export class ArticleQueue {
  private channel: ChannelWrapper;

  constructor(
    @Inject('queue') private readonly queueClient: AmqpConnectionManager,
  ) {}

  onModuleInit() {
    this.channel = this.queueClient.createChannel({
      json: true,
      setup: (chan: any) => {
        chan.assertQueue('fetch-article-queue', { durable: true });
      },
    });
  }

  onModuleDestroy() {
    return this.channel.close();
  }

  requestArticle(articleUrl: string) {
    this.channel.sendToQueue('fetch-article-queue', { articleUrl });
  }
}
