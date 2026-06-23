import { Column, Entity } from 'typeorm';
import { ChildProject } from './child-project';
import { InfrastructureSegment } from '../../../domain/types/infrastructure-segment.type';

@Entity('natural_resources_developments')
export class NaturalResourcesDevelopment extends ChildProject {
  
  @Column({ nullable: true })
  energyOutput?: string;

  @Column({ type: 'varchar', length: 24, nullable: true })
  segment?: InfrastructureSegment;

  @Column({ nullable: true })
  activeType?: string;
}