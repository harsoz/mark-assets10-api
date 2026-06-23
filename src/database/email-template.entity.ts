import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base';

@Entity('email_templates')
export class EmailTemplate extends BaseEntity {

  @Column()
  name!: string;

  @Column()
  subject!: string;

  @Column({ default: '' })
  note!: string;

  @Column({ type: 'text' })
  template!: string;
}