import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { RefreshToken } from './entities/refresh_token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(newUser: SignUpDto) {
    const user: SignUpDto = await this.userService.findUserByEmail(
      newUser.email,
    );

    if (user) {
      throw new HttpException(
        '이미 가입된 이메일 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // 해시화된 비밀번호로 DTO 업데이트
    const userToSave = {
      ...newUser,
      password: hashedPassword,
    };
    return await this.userService.save(userToSave);
  }
  //refreshtoken 미들웨어 에서 추가
  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { refresh_token: token },
    });
  }
  //로그인
  async login(
    signInDto: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = signInDto;

    const user = await this.userService.findUserByEmail(email);

    if (_.isNil(user)) {
      //null과 undeifined를 받았을경우
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      //compare는 true나 false를 받기때문에 isNil이 아닌 !연산자를 사용한다.
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const payload = { email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '12h', // Access Token 유효기간 설정
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh Token 유효기간 설정
    });

    // RefreshToken 저장 또는 갱신
    await this.refreshTokenRepository.upsert(
      {
        user_id: user.id,
        refresh_token,
      },
      ['user_id'], // upsert 시 사용자 ID를 기준으로 처리
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
