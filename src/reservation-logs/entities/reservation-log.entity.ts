import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Status } from 'src/reservation/types/reservation-status.type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reservation_logs' })
export class ReservationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservation_logs)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => User, (user) => user.reservation_logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: Status, nullable: false })
  old_status: Status;

  @Column({ type: 'enum', enum: Status, nullable: false })
  new_status: Status;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
