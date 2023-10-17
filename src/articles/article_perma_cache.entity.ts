import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'ArticlePermaCache' })
export class ArticlePermaCacheEntity extends BaseEntity {
  @Column()
  authors: string; /** Comma-separated list */

  @Column()
  title: string;

  @Column()
  body: string;

  @Column('date')
  referenceDate: Date;
}
