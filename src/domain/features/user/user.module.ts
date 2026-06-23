import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { RepositoryModule } from 'src/infrastructure/repository/repository.model';
import { UserService } from './user.service';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
