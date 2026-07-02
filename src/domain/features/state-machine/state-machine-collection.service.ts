import { Injectable } from '@nestjs/common';
import { BaseMachine } from './machines/base.machine';
import { ProjectType } from 'src/domain/types/project.type';
import { IStateMachine } from './interfaces/state-machine.interface';

@Injectable()
export class StateMachineCollectionService {
  private readonly _dictionary: Map<ProjectType, IStateMachine> = new Map();

  constructor(private readonly _baseMachine: BaseMachine) {
    // using baseMachine by default but we can create machines according the business need
    this._dictionary = new Map([
      [ProjectType.Asset, this._baseMachine],
      [ProjectType.Financing, this._baseMachine],
      [ProjectType.Development, this._baseMachine],
      [ProjectType.ConsultingArchitecture, this._baseMachine],
      [ProjectType.EnergyAsset, this._baseMachine],
      [ProjectType.Infrastructure, this._baseMachine],
      [ProjectType.RealState, this._baseMachine],
      [ProjectType.NaturalResourcesDevelopment, this._baseMachine],
      [ProjectType.NaturalResourcesFinancing, this._baseMachine],
    ]);
  }

  getMachine(projectType: ProjectType) {
    return this._dictionary.get(projectType);
  }
}
