import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from './user.entity';
import { Country } from './country.entity';

@Entity('professional_experiences')
export class ProfessionalExperience {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  company!: string;

  @Column()
  position!: string;

  @Column({ type: 'text', default: '' })
  activities!: string;

  @Column({ type: 'datetime2', nullable: true })
  from?: Date;

  @Column({ type: 'datetime2', nullable: true })
  to?: Date;

  @Column({ nullable: true })
  countryId?: number;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.professionalExperience)
  @JoinColumn({ name: 'userId' })
  user!: User;
}