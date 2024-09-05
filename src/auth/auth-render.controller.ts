import { Controller, Get, Render } from '@nestjs/common';

@Controller('auth')
export class AuthRenderController {
  // 회원가입 페이지 렌더링
  @Get('/sign-up')
  @Render('auth/sign-up.ejs') // views/auth/sign-up.ejs 파일 렌더링
  signUpPage() {}

  // 로그인 페이지 렌더링
  @Get('/sign-in')
  @Render('auth/sign-in.ejs') // views/auth/sign-in.ejs 파일 렌더링
  signInPage() {}
}
