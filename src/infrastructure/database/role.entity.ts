import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToMany, 
  OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string; 

  @Column({ default: false })
  isAdmin!: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt!: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions!: Permission[];

}