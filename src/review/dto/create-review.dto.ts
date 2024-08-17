import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: '평점은 정수여야 합니다.' })
  @Min(1, { message: '평점은 최소 1이어야 합니다.' })
  @Max(5, { message: '평점은 최대 5이어야 합니다.' })
  @IsNotEmpty({ message: '평점은 필수 항목입니다.' })
  rating: number;

  @IsString({ message: '코멘트는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '코멘트는 필수 항목입니다.' })
  comment: string;
}
