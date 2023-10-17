import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { ArticleRefStatus } from './article.consts';
import { UsersEntity } from 'src/users/users.entity';
import { ArticlePermaCacheEntity } from './article_perma_cache.entity';

@Entity({ name: 'ArticleUserRef' })
export class ArticleUserRefEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ArticleRefStatus })
  status: ArticleRefStatus;

  @Column()
  userId: string;

  @Column({ default: false })
  isArchived: boolean;

  @ManyToOne(() => UsersEntity)
  user: UsersEntity;

  @ManyToOne(() => ArticlePermaCacheEntity, { nullable: true })
  article: ArticlePermaCacheEntity;

  @Column({ nullable: true })
  articleId: string | null;
}
