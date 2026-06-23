import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { FileType } from '../../domain/types/file.type';
import { Project } from './projects/project.entity';

@Entity('project_files')
export class ProjectFile extends BaseEntity {
  
  @Column({ type: 'varchar', length: 40 })
  type!: FileType;

  @Column()
  file!: string; 

  @Column()
  fileName!: string;

  @Column({ type: 'uuid', nullable: false })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.projectFiles)
  @JoinColumn({ name: 'projectId' })
  project!: Project;
}