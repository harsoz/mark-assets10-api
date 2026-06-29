import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { AuthService } from './auth.service';
import { PhoneService } from './phone.service';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/shared/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    RepositoryModule,
    JwtModule.register({
      secret: 'MaquinaDeGuerraEslaOnda#899!',
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
    ThirdPartiesModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [PhoneService, JwtStrategy, TokenService, AuthService],
})
export class AuthModule {}
