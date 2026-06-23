import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';

@Module({
  imports: [RepositoryModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
