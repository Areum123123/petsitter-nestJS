import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
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

@Entity({ name: 'reviews' }) //db에 들어갈 테이블명
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Petsitter, (petsitters) => petsitters.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pet_sitter_id' }) //FK
  petsitter: Petsitter;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) //FK
  user: User;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
