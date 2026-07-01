import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';

@Module({
  imports: [RepositoryModule, ThirdPartiesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
