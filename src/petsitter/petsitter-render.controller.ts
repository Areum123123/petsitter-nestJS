import { Controller, Get, Render } from '@nestjs/common';

@Controller('petsitters')
export class PetsitterRenderController {
  @Get('') // 펫시터소개 페이지
  @Render('petsitter/petsitter-info.ejs') // views/petsitter/list.ejs 파일을 렌더링
  listPage() {}

  @Get('reservation') // 돌보미예약페이지
  @Render('petsitter/petsitter-reservation.ejs') // views/petsitter/reservation.ejs 파일을 렌더링
  reservationPage() {}

  // @Get('/detail/:id')
  // @Render('petsitter/detail.ejs') // views/petsitter/detail.ejs 파일을 렌더링
  // detailPage() {}
}
