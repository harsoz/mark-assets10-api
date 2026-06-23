import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column 
} from 'typeorm';
import { TimeStamps } from './base/timestamps';
import { ProfileType } from '../../domain/types/profile.type';

@Entity('dynamic_fields')
export class DynamicField extends TimeStamps {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  profileType?: ProfileType;
  
  @Column({ type: 'varchar', length: 200 })
  profile!: string;

  @Column({ type: 'text' })
  jsonData!: string;
}