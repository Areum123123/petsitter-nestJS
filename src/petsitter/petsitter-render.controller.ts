import { Controller, Get, Render } from '@nestjs/common';

@Controller('petsitters')
export class PetsitterRenderController {
  @Get('') // /list
  @Render('petsitter/petsitter-info.ejs') // views/petsitter/list.ejs 파일을 렌더링
  listPage() {}

  // @Get('/detail/:id')
  // @Render('petsitter/detail.ejs') // views/petsitter/detail.ejs 파일을 렌더링
  // detailPage() {}
}
