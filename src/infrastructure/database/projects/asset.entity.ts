import { Column, Entity } from 'typeorm';
import { ChildProject } from './child-project';
import { AssetType } from 'src/domain/types/asset.type';

@Entity('assets') 
export class Asset extends ChildProject {
  @Column({ type: 'varchar', length: 24, nullable: false })
  assetType!: AssetType;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ type: 'float', nullable: true })
  landArea?: number;

  @Column({ type: 'varchar', length: 24, nullable: true })
  capRate?: string;
}