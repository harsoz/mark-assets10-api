import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCollectionService } from './project-collection.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { ProjectQueryService } from './queries/project-query.service';
import { CommandCollection } from './commands/collection.command';
import { AssetCommand } from './commands/asset.command';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';

@Module({
  imports: [RepositoryModule, ThirdPartiesModule],
  controllers: [ProjectController],
  providers: [
    ProjectCollectionService,
    AssetCommand,
    CommandCollection,
    ProjectQueryService,
    ProjectService,
  ],
})
export class ProjectModule {}
