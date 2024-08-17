import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true }) //FK User 랑 1:1
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => User, (user) => user.refresh_token, { onDelete: 'CASCADE' }) //두번째는 db테이블명이다.(user) => user.refresh_token
  @JoinColumn({ name: 'user_id' })
  user: User;
}
//(() => User): 관계대상 User
//(user) => user.refresh_token: user.refresh_token은 User엔티티에서 RefreshToken엔티티와 관계를 참조하는 필드
//user테이블에 refresh_token테이블과 관련된 컬럼
//JoinColumn({ name: 'user_id' })는 데이터베이스에서 RefreshToken 테이블의 user_id 열이 User 엔티티의 id를 참조하는 외래 키 명시
//user: User; refreshToken이 참조하는 User엔티티를 가르킨다.
