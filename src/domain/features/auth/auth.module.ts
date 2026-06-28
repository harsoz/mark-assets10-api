import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { AuthService } from './auth.service';
import { PhoneService } from './phone.service';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/shared/email/email.module';


@Module({
  imports: [
    RepositoryModule,
    JwtModule.register({
      secret: 'MaquinaDeGuerraEslaOnda#899!',
      signOptions: { expiresIn: '60m' },
    }),
    ThirdPartiesModule,
    EmailModule
  ],
  controllers: [AuthController],
  providers: [PhoneService, AuthService],
})
export class AuthModule {}
