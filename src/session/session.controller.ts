// src/session/session.controller.ts

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { RefreshToken } from 'src/auth/entities/refresh_token.entity';
//localhost:3020/api/session
@Controller('session')
export class SessionController {
  @Get()
  getSession(@Req() req: Request): any {
    // 세션 정보를 반환합니다.
    return {
      cookie: req.session.cookie,
      accessToken: req.session.accessToken, // 타입 안정성 제공
      refreshToken: req.session.refreshToken,
    };
  }
}
