import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { TimeStamps } from './base/timestamps';
import { Region } from './region.entity';

@Entity('subregions')
export class SubRegion extends TimeStamps {
  
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
  
  @Column()
  regionId!: number;

  @ManyToOne(() => Region, (region) => region.subRegions)
  @JoinColumn({ name: 'regionId' })
  region!: Region;
}