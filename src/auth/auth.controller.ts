import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from './dto/req-user.dto';
import { TokenResponse } from './dto/req-user.dto';
import { GoogleAuthGuard } from './auth.guard';

import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //회원가입
  @Post('sign-up')
  @HttpCode(201)
  async register(@Body() signUpDto: SignUpDto): Promise<SignUpResponse> {
    const user = await this.authService.register(signUpDto);

    return {
      status: 201,
      message: '회원가입이 성공적으로 처리 되었습니다.',
    };
  }

  //로그인
  @Post('sign-in')
  @HttpCode(200)
  async login(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
  ): Promise<SignInResponse> {
    const { access_token, refresh_token } =
      await this.authService.login(signInDto);

    // 세션에 액세스 토큰 저장
    req.session.accessToken = access_token;

    return {
      status: 200,
      message: '로그인 성공했습니다.',
      data: { access_token, refresh_token },
    };
  }

  //토큰재발급
  @Post('token')
  @UseGuards(AuthGuard('refreshToken'))
  async refreshToken(@Req() req: CustomRequest): Promise<TokenResponse> {
    console.log('Req:', req.user);
    const userId = req.user.id;

    return await this.authService.refreshToken(userId);
  }

  //로그아웃
  @Post('sign-out')
  @UseGuards(AuthGuard('refreshToken'))
  async signOut(
    @Req() req: CustomRequest,
  ): Promise<{ status: number; message: string }> {
    const userId = req.user.id;
    await this.authService.signOut(userId);

    return {
      status: 200,
      message: '로그아웃이 성공적으로 처리 되었습니다.',
    };
  }

  //구글 로그인
  @Get('to-google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: CustomRequest, @Res() res: Response) {
    //구글계정로그인후 리다이렉트 페이지에 user정보
    const { user } = req;

    const email = user.email;
    const tokens = await this.authService.googleLogin(email);

    // 세션에 액세스 토큰 저장
    req.session.accessToken = tokens.access_token;

    // 리다이렉트
    res.redirect('http://localhost:3020');
    // return { status: 200, message: '로그인 성공', data: tokens };
  }

  //req 테스트
  @Post('test')
  @UseGuards(AuthGuard()) //인증도 해주고 req로 user객체를 보내준다.
  async test(@Req() req: CustomRequest) {
    //req에 들어가있는 정보들
    console.log('req', req);
  }
}
