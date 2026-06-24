import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectCollectionService } from './project-collection.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';

@Module({
  imports: [RepositoryModule],
  controllers: [ProjectController],
  providers: [ProjectCollectionService, ProjectService],
})
export class ProjectModule {}
