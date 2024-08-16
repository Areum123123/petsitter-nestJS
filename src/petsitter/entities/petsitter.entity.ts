import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pet_sitters')
export class PetSitter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  experience: string;

  @Column({ type: 'varchar' })
  certification: string;

  @Column({ type: 'varchar' })
  region: string;

  @Column({ type: 'float', nullable: true })
  total_rate?: number; // `total_rate`는 선택적입니다.

  @Column({ type: 'varchar' })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
