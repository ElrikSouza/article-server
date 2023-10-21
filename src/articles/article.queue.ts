import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import ChannelWrapper from 'amqp-connection-manager/dist/types/ChannelWrapper';
import { ConsumeMessage } from 'amqplib';
import { RabbitMQUtils } from 'src/common/rabbitmq.utils';
import { ArticlesService } from './articles.service';
import { ArticleSavedNotificationDTO } from './dto/article-saved-notification.dto';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ArticleQueue {
  private channel: ChannelWrapper;
  private articleService: ArticlesService;

  constructor(
    @Inject('queue') private readonly queueClient: AmqpConnectionManager,
    private readonly modRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.articleService = this.modRef.get(ArticlesService);
    this.channel = this.queueClient.createChannel({
      json: true,
      setup: (chan: any) => {
        chan.assertQueue('fetch-articles-queue', { durable: true });
        chan.assertQueue('reply-articles-queue', { durable: true });
      },
    });

    this.channel.consume('reply-articles-queue', this.saveArticle, {
      noAck: true,
    });
  }

  onModuleDestroy() {
    console.log('closing');
    return this.channel.close();
  }

  saveArticle = async (response: ConsumeMessage) => {
    const article =
      RabbitMQUtils.parseResponsePayload<ArticleSavedNotificationDTO>(response);

    console.log(article);

    await this.articleService.saveCacheEntry(article);
  };

  requestArticle(articleUrl: string) {
    console.log('to reply');
    this.channel.sendToQueue('fetch-articles-queue', { articleUrl });
  }
}
