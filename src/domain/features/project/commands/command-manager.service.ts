import { Injectable } from '@nestjs/common';
import { ICommand } from '../interfaces/command.interface';
import { ProjectType } from 'src/domain/types/project.type';
import { AssetCommandService } from './asset-command.service';

@Injectable()
export class CommandManagerService {
  private readonly _collection: Map<ProjectType, ICommand> = new Map();

  // if one project needs methods which are not required for others, create the special type
  // validate getCommand to look into both collections
  //private readonly _collectionSpecial: Map<ProjectType, IDetailsCommandSpecial> = new Map();

  constructor(private readonly _assetCommand: AssetCommandService) {
    this._collection = new Map<ProjectType, ICommand>([
      [ProjectType.Asset, this._assetCommand],
    ]);
  }

  getCommand(projectType: ProjectType) {
    return this._collection.get(projectType);
  }
}
