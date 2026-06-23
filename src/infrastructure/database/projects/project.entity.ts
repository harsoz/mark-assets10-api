import { 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Entity,
  OneToMany
} from 'typeorm';
import { BaseEntity } from '../base/base';
import { User } from '../user.entity';
import { Country } from '../country.entity';
import { State } from '../state.entity';
import { City } from '../city.entity';
import { ProjectStatus } from '../../../domain/types/project-status.type';
import { Currency } from '../../../domain/types/currency.type';
import { MeasureUnit } from '../../../domain/types/measure-unit.type';
import { ProjectFile } from '../project-file.entity';
import { ProjectType } from '../../../domain/types/project.type';

@Entity("projects")
export class Project extends BaseEntity {

  @Column({ type: 'varchar', length: 24, nullable: true })
  status?: ProjectStatus;

  @Column({ type: 'varchar', length: 24, enum: Currency, default: Currency.USD })
  currency!: Currency;

  @Column({ type: 'varchar', length: 24, enum: MeasureUnit, default: MeasureUnit.Sqft })
  measureUnit!: MeasureUnit;

  @Column({ type: 'varchar', length: 50, enum: ProjectType, default: ProjectType.Asset })
  projectType!: ProjectType;

  @Column()
  title!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  mainPicture?: string;

  @Column({ nullable: true })
  latitude?: string;

  @Column({ nullable: true })
  longitude?: string;

  @Column({ type: 'text', nullable: true })
  sellingConditions?: string;

  @Column({ type: 'text', nullable: true })
  sellingWindow?: string;

  @Column({ type: 'text', nullable: true })
  restrictionsAndRequirements?: string;

  @Column({ type: 'float', nullable: true })
  minPrice?: number;

  @Column({ type: 'float', nullable: true })
  maxPrice?: number;

  @Column({ nullable: true }) countryId?: number;
  @Column({ nullable: true }) stateId?: number;
  @Column({ nullable: true }) cityId?: number;

  @Column() ownerId!: string;
  @Column({ nullable: true }) approverId?: string;
  @Column({ nullable: true }) lawyerId?: string;
  @Column({ nullable: true }) analystId?: string;
  @Column({ nullable: true }) clientId?: string;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({ name: 'stateId' })
  state?: State;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city?: City;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approverId' })
  approver?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lawyerId' })
  lawyer?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'analystId' })
  analyst?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: User;

  @OneToMany(() => ProjectFile, (projectFile) => projectFile)
  projectFiles?: ProjectFile[]; 
}