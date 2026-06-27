import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCollectionService } from './project-collection.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { ProjectQuery } from './queries/project.query';
import { CommandCollection } from './commands/collection.command';
import { AssetCommand } from './commands/asset.command';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';
import { ConsultingArchitectureCommand } from './commands/consulting-architecture.command';
import { DevelopmentCommand } from './commands/development.command';
import { EnergyAssetCommand } from './commands/energy-asset.command';
import { FinancingCommand } from './commands/financing.command';
import { InfrastructureCommand } from './commands/infrastructure.command';
import { NaturalResourcesDevelopmentCommand } from './commands/natural-resources-dev.command';
import { NaturalResourcesFinancingCommand } from './commands/natural-resources-fin.command';
import { RealStateCommand } from './commands/real-state.command';

@Module({
  imports: [RepositoryModule, ThirdPartiesModule],
  controllers: [ProjectController],
  providers: [
    ProjectCollectionService,
    AssetCommand,
    ConsultingArchitectureCommand,
    DevelopmentCommand,
    EnergyAssetCommand,
    FinancingCommand,
    InfrastructureCommand,
    NaturalResourcesDevelopmentCommand,
    NaturalResourcesFinancingCommand,
    RealStateCommand,
    CommandCollection,
    ProjectQuery,
    ProjectService,
  ],
  exports: [CommandCollection]
})
export class ProjectModule {}
