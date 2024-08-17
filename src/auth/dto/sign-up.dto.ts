import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해 주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '전화번호는 필수 입력 항목입니다.' })
  @Matches(/^\d{10,12}$/, {
    message: '전화번호는 10자리에서 12자리 사이의 숫자만 포함해야 합니다.',
  })
  phone_number: string;

  @IsString()
  @IsNotEmpty({ message: '주소는 필수 입력 항목입니다.' })
  @Length(5, 100, {
    message: '주소는 최소 5자 이상, 최대 100자 이하이어야 합니다.',
  })
  address: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}

export interface SignUpResponse {
  status: number;
  message: string;
}
