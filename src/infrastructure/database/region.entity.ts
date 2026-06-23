import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany
} from 'typeorm';
import { TimeStamps } from './base/timestamps';
import { SubRegion } from './subregion.entity';

@Entity('regions')
export class Region extends TimeStamps {
  
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', default: '' })
  translations!: string;

  @Column({ default: '' })
  flag!: string;

  @Column({ nullable: true, default: '' })
  wikiDataId?: string;

  @OneToMany(() => SubRegion, (subRegion) => subRegion.region)
  subRegions!: SubRegion[];
}