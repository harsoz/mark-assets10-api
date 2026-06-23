import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';

@Module({
  imports: [RepositoryModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
