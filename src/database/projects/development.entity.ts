import { Column, Entity } from 'typeorm';
import { DevelopmentSubtype } from '../../types/development-subtype.type';
import { ChildProject } from './child-project';

@Entity('developments')
export class Development extends ChildProject {

  @Column({ type: 'varchar', length: 24, nullable: true })
  projectSubtype?: DevelopmentSubtype;

  @Column({ nullable: true })
  landAvailable?: boolean;

  @Column({ type: 'float', nullable: true })
  landArea?: number;

  @Column({ nullable: true })
  activeType?: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;
}