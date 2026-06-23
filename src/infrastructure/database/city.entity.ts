import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Location } from './base/location';
import { State } from './state.entity';

@Entity('cities')
export class City extends Location {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column()
  stateCode!: string;

  @Column()
  countryId!: number;

  @Column()
  countryCode!: string;

  @Column({ default: 0 }) 
  flag!: number;

  @Column({ nullable: true })
  wikiDataId?: string;

  @Column()
  stateId!: number;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'stateId' })
  state!: State;
}