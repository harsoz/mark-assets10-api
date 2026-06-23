import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from './user.entity';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  institution!: string;

  @Column()
  title!: string;

  @Column()
  certificationName!: string;

  @Column()
  institutionCertifies!: string;

  @Column()
  certificationYear!: string;

  @Column({ type: 'datetime2', nullable: true })
  from?: Date;

  @Column({ type: 'datetime2', nullable: true })
  to?: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.education, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}