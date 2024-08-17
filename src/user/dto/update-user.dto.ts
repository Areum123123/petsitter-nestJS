import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  // @Matches(/^\d{10,12}$/, {
  //   message: '전화번호는 10자리에서 12자리 사이의 숫자만 포함해야 합니다.',
  // })
  phone_number?: string;

  @IsOptional()
  @IsString()
  // @Length(5, 100, {
  //   message: '주소는 최소 5자 이상, 최대 100자 이하이어야 합니다.',
  // })
  address?: string;
}
