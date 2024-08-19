import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../types/reservation-status.type';

@Entity({ name: 'reservations' })
@Unique(['petsitter', 'booking_date']) // 유니크 제약 조건 설정
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Petsitter, (petsitter) => petsitter.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pet_sitter_id' })
  petsitter: Petsitter;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', nullable: false })
  dog_name: string;

  @Column({ type: 'varchar', nullable: false })
  dog_breed: string;

  @Column({ type: 'varchar', nullable: false })
  dog_age: string;

  @Column({ type: 'varchar', nullable: false })
  dog_weight: string;

  @Column({ type: 'text', nullable: true })
  request_details: string;

  @Column({ type: 'timestamp', nullable: false })
  booking_date: Date;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  //   @OneToMany(
  //     () => ReservationLog,
  //     (reservationLog) => reservationLog.reservation,
  //   )
  //   reservation_logs: ReservationLog[];
}
