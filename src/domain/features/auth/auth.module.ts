import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { AuthService } from './auth.service';
import { PhoneService } from './phone.service';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';


@Module({
  imports: [
    RepositoryModule,
    JwtModule.register({
      secret: 'MaquinaDeGuerraEslaOnda#899!',
      signOptions: { expiresIn: '60m' },
    }),
    ThirdPartiesModule
  ],
  controllers: [],
  providers: [PhoneService, AuthService],
})
export class AuthModule {}
