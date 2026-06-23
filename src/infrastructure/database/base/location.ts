import { Column, BaseEntity } from 'typeorm';
import { TimeStamps } from './timestamps';

export class Location extends TimeStamps {
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude!: number;
}