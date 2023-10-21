import { CommonEntityFields } from 'src/common/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'ArticlePermaCache' })
export class ArticlePermaCacheEntity extends CommonEntityFields {
  @Column()
  @Index()
  url: string;

  @Column()
  authors: string; /** Comma-separated list */

  @Column()
  title: string;

  @Column()
  body: string;

  @Column('date')
  referenceDate: Date;
}
