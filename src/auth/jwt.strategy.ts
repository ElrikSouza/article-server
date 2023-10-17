import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenPayload } from './auth.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      igoreExpiration: false,
      secretOrKey: 'temp',
    });
  }

  async validate(payload: AuthTokenPayload): Promise<AuthTokenPayload> {
    return payload;
  }
}
