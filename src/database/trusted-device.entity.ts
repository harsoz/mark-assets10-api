import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { BaseEntity } from './base/base';
import { User } from './user.entity';

@Entity('trusted_devices')
export class TrustedDevice extends BaseEntity {

  @Column()
  userId!: string;

  @Column()
  deviceId!: string;

  @Column({ type: 'datetime2', default: () => 'DATEADD(day, 1, CURRENT_TIMESTAMP)' })
  expiresAt?: Date;

  @ManyToOne(() => User, (user) => user.trustedDevices)
  @JoinColumn({ name: 'userId' })
  user!: User;
}