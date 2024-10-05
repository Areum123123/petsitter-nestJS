// src/types/express-session.d.ts

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    accessToken?: string; // 원하는 속성 추가
    refreshToken?: string;
  }
}

//로그인할때 세션에 저장할 데이터 커스터마이징
