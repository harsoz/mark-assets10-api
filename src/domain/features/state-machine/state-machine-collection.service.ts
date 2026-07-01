import { Injectable } from '@nestjs/common';
import { AssetsMachine } from './machines/assets-machine.state';
import { ProjectType } from 'src/domain/types/project.type';
import { IStateMachine } from './interfaces/state-machine.interface';

@Injectable()
export class StateMachineCollectionService {
  private readonly _dictionary: Map<ProjectType, IStateMachine> = new Map();

  constructor(private readonly _assetsMachine: AssetsMachine) {
    // using assetMachine by default
    this._dictionary = new Map([
      [ProjectType.Asset, this._assetsMachine],
      [ProjectType.Financing, this._assetsMachine],
      [ProjectType.Development, this._assetsMachine],
    ]);
  }

  getMachine(projectType: ProjectType) {
    return this._dictionary.get(projectType);
  }
}
