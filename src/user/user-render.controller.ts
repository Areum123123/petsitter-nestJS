import { Controller, Get, Render } from '@nestjs/common';

@Controller('users')
export class UserRenderController {
  //내정보조회 페이지 렌더링
  @Get('/profile')
  @Render('user/my-profile.ejs') // views/auth/my-profile.ejs 파일을 렌더링
  myProfilePage() {}

  // 내정보 수정
  @Get('/edit')
  @Render('user/edit-profile.ejs') // views/user/edit-profile.ejs 파일 렌더링
  editProfilePage() {}
}
