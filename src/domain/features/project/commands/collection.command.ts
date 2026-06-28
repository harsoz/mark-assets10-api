import { Injectable } from '@nestjs/common';
import { ICommand } from '../interfaces/command.interface';
import { ProjectType } from 'src/domain/types/project.type';
import { AssetCommand } from './asset.command';
import { RealStateCommand } from './real-state.command';
import { NaturalResourcesFinancingCommand } from './natural-resources-fin.command';
import { NaturalResourcesDevelopmentCommand } from './natural-resources-dev.command';
import { FinancingCommand } from './financing.command';
import { InfrastructureCommand } from './infrastructure.command';
import { EnergyAssetCommand } from './energy-asset.command';
import { DevelopmentCommand } from './development.command';
import { ConsultingArchitectureCommand } from './consulting-architecture.command';

@Injectable()
export class CommandCollection {
  private readonly _collection: Map<ProjectType, ICommand> = new Map();

  // if one project needs methods which are not required for others, create the special interface and type guard to
  // validate method to be used by the service

  constructor(
    private readonly _assetCommand: AssetCommand,
    private readonly _consultingArchitecture: ConsultingArchitectureCommand,
    private readonly _development: DevelopmentCommand,
    private readonly _energyAsset: EnergyAssetCommand,
    private readonly _infrastructure: InfrastructureCommand,
    private readonly _financing: FinancingCommand,
    private readonly _naturalResourcesDevelopment: NaturalResourcesDevelopmentCommand,
    private readonly _naturalResourcesFinancing: NaturalResourcesFinancingCommand,
    private readonly _realState: RealStateCommand,
  ) {
    this._collection = new Map<ProjectType, ICommand>([
      [ProjectType.Asset, this._assetCommand],
      [ProjectType.ConsultingArchitecture, this._consultingArchitecture],
      [ProjectType.Development, this._development],
      [ProjectType.EnergyAsset, this._energyAsset],
      [ProjectType.Infrastructure, this._infrastructure],
      [ProjectType.Financing, this._financing],
      [ProjectType.NaturalResourcesDevelopment, this._naturalResourcesDevelopment],
      [ProjectType.NaturalResourcesFinancing, this._naturalResourcesFinancing],
      [ProjectType.RealState, this._realState],
    ]);
  }

  getCommand(projectType: ProjectType) {
    return this._collection.get(projectType);
  }

  getCommandCollection(){
    return this._collection;
  }
}
