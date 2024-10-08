import { Controller, Get, Patch, Render } from '@nestjs/common';

@Controller('review')
export class reviewRenderController {
  @Get('my')
  @Render('review/my-review.ejs')
  myReviewPage() {}

  @Get('/edit/:reviewId')
  @Render('review/edit-review.ejs')
  editReviewPage() {}
}
