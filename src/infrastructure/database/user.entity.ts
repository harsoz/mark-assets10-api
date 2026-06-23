import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToMany, 
  JoinTable, 
  OneToMany, 
  ManyToOne, 
  OneToOne, 
  JoinColumn 
} from 'typeorm';
import { LanguageType } from '../../domain/types/language.type';
import { UserStatus } from '../../domain/types/user-status.type';
import { Role } from './role.entity';
import { ProfessionalExperience } from './professional-experience.entity';
import { Education } from './education.entity';
import { UserProject } from './user-project.entity';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import { VerifiedPhone } from './verified-phone.entity';
import { UserDynamicField } from './user-dynamic-field.entity';
import { TrustedDevice } from './trusted-device.entity';

@Entity('users') 
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ unique: true })
  email: string = '';

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: '' })
  name: string = '';

  @Column({ default: '' })
  password: string = ''; 

  @Column({ default: '' })
  phoneVerificationCode: string = '';

  @Column({ default: false })
  rewardClaimed: boolean = false;

  @Column({ default: false })
  isAdmin: boolean = false;

  @Column({ default: false })
  isFirstPasswordChanged: boolean = false;

  @Column({ type: 'varchar', length: 24 })
  status: UserStatus = UserStatus.Active;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true, type: 'text' })
  aboutMe?: string;

  @Column({ nullable: true })
  xSocial?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  projectCapacity?: number;

  @Column({ nullable: true, type: 'text' })
  aboutCompany?: string;

  @Column({ type: 'varchar', length: 24, enum: LanguageType, nullable: true })
  language: LanguageType = LanguageType.ES;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' }) 
  roles?: Role[];

  @OneToMany(() => ProfessionalExperience, (exp) => exp.user)
  professionalExperience?: ProfessionalExperience[];

  @OneToMany(() => Education, (edu) => edu.user)
  education?: Education[];

  @OneToMany(() => VerifiedPhone, (verifiedPhone) => verifiedPhone.user)
  verifiedPhones?: VerifiedPhone[];

  @OneToMany(() => UserDynamicField, (dynamicField) => dynamicField.user)
  dynamicFields?: UserDynamicField[];

  @OneToMany(() => TrustedDevice, (trustedDevice) => trustedDevice.user)
  trustedDevices?: TrustedDevice[];

  @Column({ nullable: true })
  countryId?: number;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @Column({ nullable: true })
  stateId?: number;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({ name: 'stateId' })
  state?: State;

  @Column({ nullable: true })
  cityId?: number;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city?: City;
}