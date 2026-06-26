import { Module } from '@nestjs/common';
import { DynamicFieldController } from './dynamic-field.controller';
import { DynamicFieldService } from './dynamic-field.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [DynamicFieldController],
  providers: [DynamicFieldService],
})
export class DynamicFieldModule {}
