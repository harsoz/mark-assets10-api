import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn,
  BeforeInsert
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base/base'; 

@Entity('auth_codes')
export class AuthCode extends BaseEntity {

  @Column()
  userId!: string;

  @Column()
  code!: string;

  @Column({ default: false })
  used!: boolean;

  @Column({ type: 'datetime2', nullable: true })
  expiresAt!: Date;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @BeforeInsert()
  setExpirationDate() {
    if (!this.expiresAt) {
      const now = new Date();
      this.expiresAt = new Date(now.getTime() + 2 * 60 * 1000); 
    }
  }
}