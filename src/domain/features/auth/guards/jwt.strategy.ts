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

  async validate(payload: any) {
    // Lo que retornes en esta función es EXACTAMENTE lo que se guardará en req.user
    // En tu caso, tu payload tenía 'sub' (id) y 'email'
    return { 
      id: payload.sub, 
      email: payload.email 
      // role: payload.role 
    };
  }
}