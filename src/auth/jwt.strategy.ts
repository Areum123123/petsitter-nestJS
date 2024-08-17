import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰이 authorization이고 Bearer인지체크
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'), //토큰이 유효한지 체크할때 사용
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email); //email로 user를 가지고 와서 있으면 return
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
    //user정보를 req로 보내지면 그냥 볼수없고
    //UserGuards안에 @nestjs/passport에서 가져온 AuthGuard()를 이용하면 요청안에 유저 정보를 넣어 줄수있다.
    //컨트롤러에서 API 에 사용하면 됩니다.
  }
}
