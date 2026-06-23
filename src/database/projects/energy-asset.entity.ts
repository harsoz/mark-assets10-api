import { Column, Entity } from 'typeorm';
import { FinancingSubtype } from '../types/financing-subtype.type';
import { InfrastructureType } from '../types/infrastructure.type';
import { InfrastructureSegment } from '../types/infrastructure-segment.type';
import { ChildProject } from './child-project';

@Entity('energy_assets')
export class EnergyAsset extends ChildProject {

  @Column({ type: 'varchar', length: 24, nullable: true })
  projectSubtype?: FinancingSubtype;

  @Column({ type: 'varchar', length: 24 })
  infrastructureType!: InfrastructureType;

  @Column({ nullable: true })
  energyOutput?: string;

  @Column({ type: 'varchar', length: 24, nullable: true })
  segment?: InfrastructureSegment;

  @Column({ nullable: true })
  storageIncluded?: boolean;

  @Column({ nullable: true })
  ppaContract?: boolean; 
}