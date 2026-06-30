import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: _configService.get<string>('ACCESS_TOKEN_SECRET') ?? '', 
    });
  }
  
  // get the user props accordingly
  // const user = await this.userService.findOneWithPermissions(payload.sub);

  async validate(payload: any) {
    // this will enable User props from CurrentUser decorator
    return { 
      id: payload.sub, 
      email: payload.email,
      role: '',
      permissions: []
    };
  }
}