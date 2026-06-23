import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RepositoryModule } from './infrastructure/repository/repository.model';
import { ThirdPartiesModule } from './shared/third-parties/third-parties.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RepositoryModule,
    ThirdPartiesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
