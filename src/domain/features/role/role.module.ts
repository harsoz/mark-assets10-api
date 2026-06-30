import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
