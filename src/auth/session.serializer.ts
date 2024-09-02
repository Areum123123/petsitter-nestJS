// src/auth/session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user.id); // 세션에 사용자 ID를 저장
  }

  async deserializeUser(userId: number, done: Function) {
    const user = await this.userService.findOne({ where: { id: userId } });
    done(null, user); // 세션에서 사용자를 복원
  }
}
