import { Controller, Get, Render } from '@nestjs/common';

@Controller('review')
export class reviewRenderController {
  @Get('my')
  @Render('review/my-review.ejs')
  myReviewPage() {}
}
