import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT_NUMBER;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }), //dto를 사용하기 위해 꼭 필요한것
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  // Cookie-parser middleware 추가
  app.use(cookieParser());

  // express-session 설정
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY, // 환경 변수로 설정된 세션 비밀
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효 기간 (24시간)
        httpOnly: true, // 클라이언트 측 스크립트에서 쿠키 접근 방지
        secure: false, //HTTP 환경에서는 false //process.env.NODE_ENV === 'production', HTTPS 환경에서만 쿠키 전송
        sameSite: 'lax', // CSRF 공격 방지
      },
    }),
  );

  // Express 설정
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3020/api/users/profile', // 프론트엔드 URL 설정
    credentials: true, // 쿠키를 포함한 요청 허용
  });

  //여러 cors
  // app.enableCors({
  //   origin: ['http://localhost:3000', 'http://example.com'], // 허용할 도메인 배열
  //   credentials: true, // 쿠키를 포함한 요청 허용
  // });
  await app.listen(PORT);
}
bootstrap();
