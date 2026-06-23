import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  value!: string; 

  @Column()
  roleId!: string;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role?: Role;
}