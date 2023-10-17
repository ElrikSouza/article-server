import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FETCH_ARTICLE_QUEUE } from 'src/temp.consts';
import { ArticleQueue } from './article.queue';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleQueue],
  imports: [AuthModule, QueueModule],
})
export class ArticlesModule {}
