import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UserId } from 'src/auth/user.decorator';
import { ArticlesService } from './articles.service';
import { SaveArticleDTO } from './dto/save-article.dto';

@UseGuards(JwtGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getArticles(@UserId() userId: string) {
    return { test: 'teste', userId };
  }

  @Post()
  async saveArticle(@Body() dto: SaveArticleDTO, @UserId() userId: string) {
    await this.articlesService.saveArticle({
      articleUrl: dto.articleUrl,
      userId,
    });
  }
}
