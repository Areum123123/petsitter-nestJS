// src/types/express-session.d.ts

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    accessToken?: string; // 원하는 속성 추가
  }
}
