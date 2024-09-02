import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';

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

  // express-session 설정
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY, // 이 키는 중요한 데이터이므로 환경 변수에 저장하세요.
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 120000, // 쿠키의 유효 기간 (2분)
      },
    }),
  );

  // Express 설정
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(PORT);
}
bootstrap();
