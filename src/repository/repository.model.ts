import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as allEntities from 'src/database';
import * as allRepositories from './index';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(allEntities))],
  providers: [...Object.values(allRepositories)],
  exports: [...Object.values(allRepositories)],
})
export class RepositoryModule {}
