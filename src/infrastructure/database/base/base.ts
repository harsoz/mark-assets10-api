import { PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamps } from './timestamps';

export abstract class BaseEntity extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}