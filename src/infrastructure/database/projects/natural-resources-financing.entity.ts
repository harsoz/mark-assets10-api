import { Entity, Column } from 'typeorm';
import { ChildProject } from './child-project';
import { FinancingSubtype } from '../../../domain/types/financing-subtype.type';

@Entity('natural_resources_financings')
export class NaturalResourcesFinancing extends ChildProject {
  
  @Column({ type: 'varchar', length: 24, nullable: true })
  projectSubtype?: FinancingSubtype;

  @Column({ nullable: true })
  activeType?: string;
}