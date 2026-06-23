import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleManagerService } from './role-manager.service';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleManagerService, RoleService],
})
export class RoleModule {}
