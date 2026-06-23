import { Column, Entity } from 'typeorm';
import { DevelopmentSubtype } from '../../types/development-subtype.type';
import { ServiceType } from '../../types/service.type';
import { ChildProject } from './child-project';

@Entity('consulting_architectures') 
export class ConsultingArchitecture extends ChildProject {
  @Column({ type: 'varchar', length: 24, nullable: true })
  projectSubtype?: DevelopmentSubtype;

  @Column({ type: 'varchar', length: 24, nullable: true })
  serviceType?: ServiceType;

  @Column({ nullable: true })
  landAvailable?: boolean;
}