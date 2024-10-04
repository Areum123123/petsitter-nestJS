import { Controller, Get, Render } from '@nestjs/common';

@Controller('reservation')
export class reservationRenderController {
  @Get('')
  @Render('reservation/reservation-page.ejs') // views/reservation/reservation-page.ejs 파일을 렌더링
  reservationPage() {}

  @Get('me') //user예약목록페이지
  @Render('reservation/reservation-list.ejs')
  reservationList() {}
}
