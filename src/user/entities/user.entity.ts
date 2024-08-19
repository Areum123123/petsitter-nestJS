import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../types/user-role.type';
import { RefreshToken } from 'src/auth/entities/refresh_token.entity';
import { Exclude } from 'class-transformer';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationLog } from 'src/reservation-logs/entities/reservation-log.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
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

  @OneToMany(() => ReservationLog, (reservationLog) => reservationLog.user)
  reservation_logs: ReservationLog[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}

//()=>RefreshToken 관계설정할 대상
// (refreshToken) => refreshToken.user  RefreshToken 엔티티 내에서 user엔티티에 대한 참조필드
//refresh_token: RefreshToken  USer엔티티가 refresh_token필드를 통해 관련된 RefreshToken 엔티티에 접근
