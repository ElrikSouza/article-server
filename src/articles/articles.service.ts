import { Injectable } from '@nestjs/common';
import { SaveArticleBO } from './bo/save-article.bo';
import { ArticleQueue } from './article.queue';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleUserRefEntity } from './article-user-ref.entity';
import { EntityManager, Repository } from 'typeorm';
import { ArticlePermaCacheEntity } from './article_perma_cache.entity';
import { ArticleRefStatus } from './article.consts';
import { ArticleSavedNotificationDTO } from './dto/article-saved-notification.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articleQueue: ArticleQueue,

    @InjectRepository(ArticleUserRefEntity)
    private readonly articleUserRefRepo: Repository<ArticleUserRefEntity>,

    @InjectRepository(ArticlePermaCacheEntity)
    private readonly articlePermaCacheRepo: Repository<ArticlePermaCacheEntity>,
  ) {}

  async getExistingArticleCacheEntryId(
    articleUrl: string,
    transaction?: EntityManager,
  ): Promise<string | null> {
    if (!transaction) {
      return this.articlePermaCacheRepo.manager.transaction((t) => {
        return this.getExistingArticleCacheEntryId(articleUrl, t);
      });
    }

    const result = await transaction.findOneBy(ArticlePermaCacheEntity, {
      url: articleUrl,
    });

    if (!result) return null;

    return result.id;
  }

  async getUserArticleRefs(userId: string) {
    return this.articleUserRefRepo.find({
      where: { userId },
      relations: { article: true },
    });
  }

  async saveCacheEntry(
    saveNotification: ArticleSavedNotificationDTO,
    transaction?: EntityManager,
  ) {
    if (!transaction) {
      return this.articlePermaCacheRepo.manager.transaction((t) => {
        return this.saveCacheEntry(saveNotification, t);
      });
    }

    const newCacheEntry = this.articlePermaCacheRepo.create({
      url: saveNotification.url,
      body: saveNotification.body,
      title: saveNotification.title,
      authors: saveNotification.authors.join(', '),
      referenceDate: new Date(),
    });

    const savedEntry = await transaction.save(
      ArticlePermaCacheEntity,
      newCacheEntry,
    );

    // update all articles that were waiting for this url
    await transaction
      .createQueryBuilder()
      .update(ArticleUserRefEntity)
      .where({ articleUrl: saveNotification.url })
      .set({ status: ArticleRefStatus.DONE, articleId: savedEntry.id })
      .execute();
  }

  /** Saves an article for an user. If a cache entry already exists, the user ref points to the artlcle */
  async saveArticle(saveArticleBo: SaveArticleBO) {
    const cacheId = await this.getExistingArticleCacheEntryId(
      saveArticleBo.articleUrl,
    );

    if (!cacheId) {
      this.articleQueue.requestArticle(saveArticleBo.articleUrl);

      const userRef = this.articleUserRefRepo.create({
        articleUrl: saveArticleBo.articleUrl,
        userId: saveArticleBo.userId,
        status: ArticleRefStatus.LOADING,
      });

      await this.articleUserRefRepo.insert(userRef);
      return;
    }

    const userRef = this.articleUserRefRepo.create({
      articleUrl: saveArticleBo.articleUrl,
      articleId: cacheId,
      userId: saveArticleBo.userId,
      status: ArticleRefStatus.DONE,
    });

    await this.articleUserRefRepo.insert(userRef);
    return;
  }
}
