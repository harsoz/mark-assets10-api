import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/infrastructure/database';
import { RoleService } from '../role/role.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _roleService: RoleService,
  ) {}

  // we use db entity User here because we need to include the role in the token payload
  async generateAuthTokens(user: User) {
    const roles = await this._roleService.getUserRoles(user.id);
    const refreshPayload = {
      sub: user.id,
      email: user.email,
    };
    const tokenPayload = {
      ...refreshPayload,
      role: roles[0]?.name || '',
      permissions: roles.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(refreshPayload, {
        secret: this._configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
        expiresIn: '1d',
      }),
      this._jwtService.signAsync(tokenPayload, {
        secret: this._configService.get<string>('ACCESS_TOKEN_SECRET') ?? '',
        expiresIn: '60m',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // we use db entity User here because we need to include the role in the token payload
  async generateAccessToken(user: User) {
    const roles = await this._roleService.getUserRoles(user.id);
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: roles[0]?.name || '',
      permissions: roles.permissions,
    };

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
