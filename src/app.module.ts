import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ThirdPartiesModule } from './shared/third-parties/third-parties.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './domain/features/user/user.module';
import { RoleModule } from './domain/features/role/role.module';
import { LocationModule } from './domain/features/location/location.module';
import { CityModule } from './domain/features/city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ThirdPartiesModule,
    UserModule,
    RoleModule,
    LocationModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
