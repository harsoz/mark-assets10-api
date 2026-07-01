import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../../role/role.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService, private readonly _roleService: RoleService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: _configService.get<string>('ACCESS_TOKEN_SECRET') ?? '', 
    });
  }
  
  async validate(payload: any) {
    // this will enable User props from CurrentUser decorator
    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role || '',
      permissions: payload.permissions || [],
    };
  }
}