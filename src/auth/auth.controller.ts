import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';
import { SignInDto, SignInResponse } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from './dto/req-user.dto';

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
  async login(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    const { access_token, refresh_token } =
      await this.authService.login(signInDto);

    return {
      status: 200,
      message: '로그인 성공했습니다.',
      access_token,
      refresh_token,
    };
  }

  @Post('test')
  @UseGuards(AuthGuard()) //인증도 해주고 req로 user객체를 보내준다.
  async test(@Req() req: CustomRequest) {
    //req에 들어가있는 정보들
    console.log('req', req.user.phone_number);
  }
}
