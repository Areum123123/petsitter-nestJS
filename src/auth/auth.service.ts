import {
  BadRequestException,
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
import { TokenResponse } from './dto/req-user.dto';
import { GoogleRequest } from 'src/user/dto/googleuser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(newUser: SignUpDto) {
    const { password, confirm_password } = newUser;

    // 비밀번호와 비밀번호 확인이 일치하지 않으면 예외 처리
    if (password !== confirm_password) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      );
    }
    const user = await this.userService.findUserByEmail(newUser.email);

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

    const userId = user.id;

    //토큰발급
    return await this.generateTokens(email, userId);
  }

  // 토큰 재발급
  async refreshToken(userId: number): Promise<TokenResponse> {
    const user = await this.userService.findUserById(userId);
    const email = user.email;

    return await this.generateTokens(email, userId);
  }

  //구글 로그인
  async googleLogin(email) {
    if (typeof email === 'undefined') {
      return null;
    }

    const findUser = await this.userService.findUserByEmail(email);
    console.log(findUser);
    if (!findUser) {
      return null;
    }

    return await this.generateTokens(email, findUser.id);
  }

  // 토큰 발급
  async generateTokens(email: string, userId: number): Promise<TokenResponse> {
    // 토큰 발급

    const payload = { email, id: userId };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRES,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET_KEY,
      expiresIn: process.env.REFRESH_EXPIRES,
    });

    // RefreshToken 저장 또는 갱신
    await this.refreshTokenRepository.upsert(
      {
        user_id: userId,
        refresh_token,
      },
      ['user_id'], // upsert 시 사용자 ID를 기준으로 처리
    );

    return {
      access_token,
      refresh_token,
    };
  }

  //로그아웃
  async signOut(userId: number): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { user_id: userId },
    });

    refreshToken.refresh_token = null;
    await this.refreshTokenRepository.save(refreshToken);
  }
}
