import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DeleteProjectByDateJob } from './delete-project-by-date.job';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ScheduleModule.forRoot(), ProjectModule],
  providers: [DeleteProjectByDateJob],
})
export class JobModule {}