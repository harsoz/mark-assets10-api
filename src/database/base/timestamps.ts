import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimeStamps {
  @CreateDateColumn({ type: 'datetime2', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2', nullable: true })
  updatedAt!: Date;
}