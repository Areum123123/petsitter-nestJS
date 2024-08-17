import { Review } from 'src/review/entities/review.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'petsitters' })
export class Petsitter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  experience: string;

  @Column({ type: 'varchar', nullable: false })
  certification: string;

  @Column({ type: 'varchar', nullable: false })
  region: string;

  @Column({ type: 'float', nullable: true })
  total_rate: number;

  @Column({ type: 'varchar', nullable: false })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // @OneToMany(() => Reservation, (reservation) => reservation.petsitter)
  // reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.petsitter)
  reviews: Review[];
}
