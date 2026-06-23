import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { TimeStamps } from './base/timestamps';
import { User } from './user.entity';
import { Project } from './projects/project.entity';
import { ProjectType } from './types/project.type';
import { ProjectStatus } from './types/project-status.type';

@Entity('user_projects')
export class UserProject extends TimeStamps {
  
  @PrimaryGeneratedColumn('increment')
  id!: number;
  
  @Column({ nullable: true })
  userId?: string;

  // @ManyToOne(() => User, (user) => user.userProjects, { nullable: true })
  // @JoinColumn({ name: 'userId' })
  // user?: User;

  @Column()
  projectId!: string;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @Column({ type: 'varchar', length: 24 })
  projectType!: ProjectType;

  @Column({ type: 'varchar', length: 24, nullable: true })
  status?: ProjectStatus;
}