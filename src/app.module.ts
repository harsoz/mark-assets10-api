import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './domain/features/user/user.module';
import { RoleModule } from './domain/features/role/role.module';
import { LocationModule } from './domain/features/location/location.module';
import { ProjectModule } from './domain/features/project/project.module';
import { JobModule } from './domain/features/job/job.module';
import { DynamicFieldModule } from './domain/features/dynamic-field/dynamic-field.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    RoleModule,
    LocationModule,
    ProjectModule,
    JobModule,
    DynamicFieldModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
