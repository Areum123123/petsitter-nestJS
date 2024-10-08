import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()

//google 스트래티지 사용
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    //부모 클래스의 메서드 사용
    const result = (await super.canActivate(context)) as boolean;
    //컨텍스트에서 리퀘스트 객체를 꺼냄
    const request = context.switchToHttp().getRequest();

    // 로그인 후 세션 정보 로그 출력
    console.log('Session Info:', request.session);
    await super.logIn(request); //세션적용
    return result;
  }
}
