import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'werndee_jwt_secret_key_2024',
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      username: payload.username, 
      role: payload.role,
      nurseId: payload.nurseId 
    };
  }
}