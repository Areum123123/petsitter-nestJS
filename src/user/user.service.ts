import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email });
  }

  async save(signUpDto: SignUpDto): Promise<User> {
    return await this.userRepository.save(signUpDto); // 데이터베이스에 저장
  }
}
