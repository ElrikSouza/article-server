import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArticleQueue } from './article.queue';
import { QueueModule } from 'src/queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleUserRefEntity } from './article-user-ref.entity';
import { ArticlePermaCacheEntity } from './article_perma_cache.entity';

@Module({
  controllers: [ArticlesController],
  providers: [ArticleQueue, ArticlesService],
  imports: [
    AuthModule,
    QueueModule,
    TypeOrmModule.forFeature([ArticleUserRefEntity, ArticlePermaCacheEntity]),
  ],
})
export class ArticlesModule {}
