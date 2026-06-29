import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async generateAuthTokens(tokenPayload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(tokenPayload, {
        secret: this._configService.get<string>('ACCESS_TOKEN_SECRET') ?? '',
        expiresIn: '60m',
      }),

      // potentially remove most of the props
      this._jwtService.signAsync(tokenPayload, {
        secret: this._configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
        expiresIn: '1d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(tokenPayload: any) {
    return this._jwtService.signAsync(tokenPayload, {
      secret: this._configService.get<string>('ACCESS_TOKEN_SECRET') ?? '',
      expiresIn: '60m',
    });
  }

  async verifyToken(refreshToken: string) {
    return this._jwtService.verifyAsync(refreshToken, {
      secret: this._configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
    });
  }
}
