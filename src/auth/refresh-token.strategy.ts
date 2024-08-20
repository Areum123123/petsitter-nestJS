import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh_token.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 Bearer 토큰 추출
      secretOrKey: configService.get('REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    console.log('refreshToken strategy');
    // const user = req.user;
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('인증 헤더가 누락되었습니다.');
    }
    console.log(authorizationHeader);

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('유효하지 않은 토큰 형식입니다.');
    }

    // 사용자와 관련된 리프레시 토큰 조회
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { user_id: payload.id },
    });

    if (!refreshToken || token !== refreshToken.refresh_token) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    const user = await this.userService.findUserById(refreshToken.user_id);

    // 사용자 정보 반환
    return user;
  }
}
