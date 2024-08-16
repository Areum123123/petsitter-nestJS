import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  phone_number: string;

  @IsString()
  @IsNotEmpty({ message: '주소는 필수 입력 항목입니다.' })
  address: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}

export interface SignUpResponse {
  status: number;
  message: string;
}
