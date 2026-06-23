import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RepositoryModule } from './infrastructure/repository/repository.module';
import { ThirdPartiesModule } from './shared/third-parties/third-parties.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './domain/features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RepositoryModule,
    ThirdPartiesModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
