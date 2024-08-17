import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'name',
        'phone_number',
        'address',
        'role',
        'image_url',
        'created_at',
        'updated_at',
      ],
    });
  }
  async save(signUpDto: SignUpDto): Promise<User> {
    return await this.userRepository.save(signUpDto); // 데이터베이스에 저장
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'name',
        'phone_number',
        'address',
        'role',
        'image_url',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    // DTO에 포함된 값들만 업데이트
    if (updateUserDto.phone_number) {
      user.phone_number = updateUserDto.phone_number;
    }

    if (updateUserDto.address) {
      user.address = updateUserDto.address;
    }

    // 업데이트된 유저를 저장
    return await this.userRepository.save(user);
  }
}
