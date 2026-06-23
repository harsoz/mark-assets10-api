import { Column, Entity } from 'typeorm';
import { ChildProject } from './child-project';
import { FinancingSubtype } from '../types/financing-subtype.type';

@Entity('financings')
export class Financing extends ChildProject {

  @Column({ type: 'varchar', length: 24, nullable: true })
  projectSubtype?: FinancingSubtype;

  @Column({ type: 'int', nullable: true })
  amount?: number;

  @Column({ nullable: true })
  dontDisclouse?: boolean;

  @Column({ nullable: true })
  landAvailable?: boolean;

  @Column({ nullable: true })
  activeType?: string;
}