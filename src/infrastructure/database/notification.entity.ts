import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base';

@Entity('notifications')
export class Notification extends BaseEntity {

  @Column()
  title!: string;

  @Column()
  description!: string;
}