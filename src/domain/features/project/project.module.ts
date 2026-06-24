import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCollectionService } from './project-collection.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';
import { ProjectDetailsService } from './project-details.service';

@Module({
  imports: [RepositoryModule],
  controllers: [ProjectController],
  providers: [ProjectCollectionService, ProjectDetailsService, ProjectService],
})
export class ProjectModule {}
