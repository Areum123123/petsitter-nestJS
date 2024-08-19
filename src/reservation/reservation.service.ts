import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Petsitter)
    private readonly petsitterRepository: Repository<Petsitter>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async bookingCreate(
    userId: number,
    createReservationDto: CreateReservationDto,
  ) {
    const {
      pet_sitter_id,
      dog_name,
      dog_breed,
      dog_age,
      dog_weight,
      request_details,
      booking_date,
    } = createReservationDto;

    const petsitter = await this.petsitterRepository.findOne({
      where: { id: +pet_sitter_id },
    });

    if (!petsitter) {
      throw new NotFoundException('해당 펫시터를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    const reservation = this.reservationRepository.create({
      petsitter,
      dog_name,
      dog_breed,
      dog_age,
      dog_weight,
      request_details,
      booking_date: new Date(booking_date),
    });

    await this.reservationRepository.save(reservation);

    return {
      reservation_id: reservation.id,
      user_id: user.id,
      pet_details: {
        dog_name: reservation.dog_name,
        dog_breed: reservation.dog_breed,
        dog_age: reservation.dog_age,
        dog_weight: reservation.dog_weight,
        request_details: reservation.request_details,
      },
      pet_sitter: {
        pet_sitter_id: petsitter.id,
        name: petsitter.name,
        booking_date: reservation.booking_date,
      },
      created_at: reservation.created_at,
    };
  }

  findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
