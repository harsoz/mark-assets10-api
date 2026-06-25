import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCollectionService } from './project-collection.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';
import { ProjectQueryService } from './queries/project-query.service';
import { CommandManagerService } from './commands/command-manager.service';
import { AssetCommandService } from './commands/asset-command.service';

@Module({
  imports: [RepositoryModule],
  controllers: [ProjectController],
  providers: [
    ProjectCollectionService,
    AssetCommandService,
    
    CommandManagerService,
    ProjectQueryService,
    ProjectService,
  ],
})
export class ProjectModule {}
