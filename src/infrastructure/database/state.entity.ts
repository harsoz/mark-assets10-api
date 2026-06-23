import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { Location } from './base/location';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity('states')
export class State extends Location {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column()
  countryCode!: string;

  @Column()
  iso2!: string;

  @Column({ default: 0 })
  flag!: number;

  @Column({ nullable: true })
  fipsCode?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  wikiDataId?: string;

  @Column()
  countryId!: number;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({ name: 'countryId' })
  country!: Country;

  @OneToMany(() => City, (city) => city.state)
  cities!: City[];
}