import { Injectable } from '@nestjs/common';
import { assetsMachine } from './machines/assets-machine.state';
import { ProjectType } from 'src/domain/types/project.type';

@Injectable()
export class StateMachineCollectionService {
  // using assetMachine by default
  private readonly _dictionary: Map<ProjectType, any> = new Map([
    [ProjectType.Asset, assetsMachine],
    [ProjectType.Financing, assetsMachine],
    [ProjectType.Development, assetsMachine]
  ]);

  getMachine(projectType: ProjectType) {
    return this._dictionary.get(projectType);
  }
}
