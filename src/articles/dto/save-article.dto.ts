import { ApiProperty } from '@nestjs/swagger';

export class SaveArticleDTO {
  @ApiProperty()
  articleUrl: string;
}
