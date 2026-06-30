import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
