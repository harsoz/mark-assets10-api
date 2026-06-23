import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from './user.entity';
import { DynamicField } from './dynamic-field.entity';


@Entity('data_user_profiles')
export class DataUserProfile {

  @PrimaryGeneratedColumn('increment')
  id!: number;
  
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  profileDataId?: number;

  @ManyToOne(() => DynamicField, { nullable: true })
  @JoinColumn({ name: 'profileDataId' })
  profileData?: DynamicField;
  
  @Column({ type: 'text', nullable: true })
  jsonData?: string;
}