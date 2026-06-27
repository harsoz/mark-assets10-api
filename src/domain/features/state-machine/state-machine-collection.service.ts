import { Injectable } from '@nestjs/common';
import { assetsMachine } from './assets-machine.state';
import { ProjectType } from 'src/domain/types/project.type';

@Injectable()
export class StateMachineCollectionService {
  private readonly _dictionary: Map<ProjectType, any> = new Map([
    [ProjectType.Asset, assetsMachine],
  ]);

  getMachine(projectType: ProjectType) {
    return this._dictionary.get(projectType);
  }
}
