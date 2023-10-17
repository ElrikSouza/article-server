import { SaveArticleBO } from './bo/save-article.bo';
import { SaveArticleDTO } from './dto/save-article.dto';

export class ArticleMapper {
  static fromSaveDTOToBo(
    dto: SaveArticleDTO,
    extraArgs: { userId: string },
  ): SaveArticleBO {
    const bo = new SaveArticleBO();

    bo.articleUrl = dto.articleUrl;
    bo.userId = extraArgs.userId;

    return bo;
  }
}
