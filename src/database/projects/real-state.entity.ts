import { Column, Entity } from 'typeorm';
import { ChildProject } from './child-project';

@Entity('real_states')
export class RealState extends ChildProject  {

  @Column({ type: 'float', nullable: true })
  landArea?: number;

  @Column({ nullable: true })
  realStateType?: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ type: 'float', nullable: true })
  sizeInAcres?: number;

  @Column({ type: 'float', nullable: true })
  sizeInSqft?: number;

  @Column({ type: 'float' })
  totalPrice!: number;

  @Column({ type: 'float' })
  pricePerAcre!: number;

  @Column()
  suggestedUse!: string;

  @Column({ nullable: true })
  residentialSubType?: string;

  @Column({ nullable: true })
  relationShipWithOwner?: string;

  @Column()
  ownersIntention!: string;

  @Column({ default: '' })
  parcelId!: string;
}