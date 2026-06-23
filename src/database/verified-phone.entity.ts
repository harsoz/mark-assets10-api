import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { User } from './user.entity';

@Entity('verified_phones')
export class VerifiedPhone extends BaseEntity {

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.verifiedPhones, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}