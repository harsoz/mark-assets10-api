import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  JoinColumn 
} from 'typeorm';
import { Location } from './base/location';
import { State } from './state.entity';
import { Region } from './region.entity';
import { SubRegion } from './subregion.entity';

@Entity('countries')
export class Country extends Location {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column() name!: string;
  @Column() iso3!: string;
  @Column() iso2!: string;
  @Column() phoneCode!: string;
  @Column() numericCode!: string;
  @Column() capital!: string;
  @Column() currency!: string;
  @Column() currencyName!: string;
  @Column() currencySymbol!: string;
  @Column() tld!: string;
  @Column() nationality!: string;
  @Column() emoji!: string;
  @Column() emojiU!: string;
  @Column() flag!: string;

  @Column({ nullable: true }) native?: string;
  @Column({ nullable: true }) region?: string;
  @Column({ nullable: true }) subRegion?: string;
  @Column({ nullable: true }) wikiDataId?: string;

  @Column({ type: 'text' })
  timezones!: string;

  @Column({ type: 'text' })
  translations!: string;

  @Column({ nullable: true })
  regionId?: number;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  regionData?: Region;

  @Column({ nullable: true })
  subRegionId?: number;

  @ManyToOne(() => SubRegion, { nullable: true })
  @JoinColumn({ name: 'subRegionId' })
  subRegionData?: SubRegion;

  @OneToMany(() => State, (state) => state.country)
  states!: State[];
}