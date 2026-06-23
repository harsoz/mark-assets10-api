import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from './user.entity';
import { DynamicField } from './dynamic-field.entity';

@Entity('user_dynamic_fields')
export class UserDynamicField {
  
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.dynamicFields, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  dynamicFieldId?: number;

  @ManyToOne(() => DynamicField, { nullable: true })
  @JoinColumn({ name: 'dynamicFieldId' })
  dynamicField?: DynamicField;

  @Column({ type: 'text', nullable: true, default: '' })
  dynamicFieldValues?: string;
}