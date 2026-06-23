import { Entity, Column } from 'typeorm';
import { ChildProject } from './child-project';
import { InfrastructureType } from '../../types/infrastructure.type';
import { InfrastructureSegment } from '../../types/infrastructure-segment.type';

@Entity('infrastructures')
export class Infrastructure extends ChildProject {

  @Column({ type: 'varchar', length: 24 })
  infrastructureType!: InfrastructureType;

  @Column({ nullable: true })
  energyOutput?: string;

  @Column({ type: 'varchar', length: 24, nullable: true })
  segment?: InfrastructureSegment;

  @Column({ type: 'float', nullable: true })
  landArea?: number;
}