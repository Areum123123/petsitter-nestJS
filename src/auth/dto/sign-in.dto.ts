import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해 주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;
}

export interface SignInResponse {
  status: number;
  message: string;
  data: { access_token: string; refresh_token: string };
}
