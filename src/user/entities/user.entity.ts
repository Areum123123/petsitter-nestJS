import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../types/user-role.type';
import { RefreshToken } from 'src/auth/entities/refresh_token.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false }) //select로 명시하지않는이상 사용되지않음
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refresh_token: RefreshToken;
  reviews: any;
}
//()=>RefreshToken 관계설정할 대상
// (refreshToken) => refreshToken.user  RefreshToken 엔티티 내에서 user엔티티에 대한 참조필드
//refresh_token: RefreshToken  USer엔티티가 refresh_token필드를 통해 관련된 RefreshToken 엔티티에 접근
