import { Injectable } from '@nestjs/common';
import { ProjectType } from 'src/domain/types/project.type';
import { Asset, ConsultingArchitecture, Development, EnergyAsset, Financing, Infrastructure, NaturalResourcesDevelopment, NaturalResourcesFinancing, RealState } from 'src/infrastructure/database';
import {
  ConsultingArchitectureRepository,
  EnergyAssetRepository,
  FinancingRepository,
  InfrastructureRepository,
  NaturalResourcesDevelopmentRepository,
  NaturalResourcesFinancingRepository,
  RealStateRepository,
} from 'src/infrastructure/repository';
import { AssetRepository } from 'src/infrastructure/repository/asset.repository';
import { DevelopmentRepository } from 'src/infrastructure/repository/development.repository';
import { IBaseRepository } from 'src/infrastructure/repository/interfaces/base-repository.interface';

export type ProjectRegistry = {
  [ProjectType.Asset]: AssetRepository;
  [ProjectType.ConsultingArchitecture]: ConsultingArchitectureRepository;
  [ProjectType.Development]: DevelopmentRepository;
  [ProjectType.EnergyAsset]: EnergyAssetRepository;
  [ProjectType.Financing]: FinancingRepository;
  [ProjectType.Infrastructure]: InfrastructureRepository;
  [ProjectType.NaturalResourcesDevelopment]: NaturalResourcesDevelopmentRepository;
  [ProjectType.NaturalResourcesFinancing]: NaturalResourcesFinancingRepository;
  [ProjectType.RealState]: RealStateRepository;
};

export type ProjectRegistryEntities = {
  [ProjectType.Asset]: Asset;
  [ProjectType.ConsultingArchitecture]: ConsultingArchitecture;
  [ProjectType.Development]: Development;
  [ProjectType.EnergyAsset]: EnergyAsset;
  [ProjectType.Financing]: Financing;
  [ProjectType.Infrastructure]: Infrastructure;
  [ProjectType.NaturalResourcesDevelopment]: NaturalResourcesDevelopment;
  [ProjectType.NaturalResourcesFinancing]: NaturalResourcesFinancing;
  [ProjectType.RealState]: RealState;
};

@Injectable()
export class ProjectCollectionService {
  private readonly detailsRepos: Map<ProjectType, IBaseRepository<any, any>> = new Map();

  constructor(
    private readonly assetRepo: AssetRepository,
    private readonly consultingArchitectureRepo: ConsultingArchitectureRepository,
    private readonly developmentRepo: DevelopmentRepository,
    private readonly energyAssetRepo: EnergyAssetRepository,
    private readonly financingRepo: FinancingRepository,
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly naturalResourcesDevelopmentRepo: NaturalResourcesDevelopmentRepository,
    private readonly naturalResourcesFinancingRepo: NaturalResourcesFinancingRepository,
    private readonly realStateRepo: RealStateRepository,
  ) {
    this.detailsRepos = new Map<ProjectType, any>([
      [ProjectType.Asset, this.assetRepo],
      [ProjectType.ConsultingArchitecture, this.consultingArchitectureRepo],
      [ProjectType.Development, this.developmentRepo],
      [ProjectType.EnergyAsset, this.energyAssetRepo],
      [ProjectType.Financing, this.financingRepo],
      [ProjectType.Infrastructure, this.infrastructureRepo],
      [
        ProjectType.NaturalResourcesDevelopment,
        this.naturalResourcesDevelopmentRepo,
      ],
      [
        ProjectType.NaturalResourcesFinancing,
        this.naturalResourcesFinancingRepo,
      ],
      [ProjectType.RealState, this.realStateRepo],
    ]);
  }

  getProjectDetailEngine<T extends ProjectType>(projectType: T): ProjectRegistry[T] {
    const key = Number(projectType);
    const engine = this.detailsRepos.get(key);
    if (!engine) {
      throw new Error(`Engine not found for: ${projectType}`);
    }
    return engine as ProjectRegistry[T];
  }
}
