import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleManagerService } from './role-manager.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';

@Module({
  imports: [RepositoryModule],
  controllers: [RoleController],
  providers: [RoleManagerService, RoleService],
})
export class RoleModule {}
