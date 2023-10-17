import { Injectable } from '@nestjs/common';
import { SaveArticleBO } from './bo/save-article.bo';
import { ArticleQueue } from './article.queue';

@Injectable()
export class ArticlesService {
  constructor(private readonly articleQueue: ArticleQueue) {}

  async saveArticle(saveArticleBo: SaveArticleBO) {
    this.articleQueue.requestArticle(saveArticleBo.articleUrl);
  }
}
