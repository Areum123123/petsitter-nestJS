import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/types/user-role.type';
import {
  bookingReservation,
  getAllReservation,
} from './dto/reservation-res.dto';

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
  ): Promise<bookingReservation> {
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
      user,
      petsitter,
      dog_name,
      dog_breed,
      dog_age,
      dog_weight,
      request_details,
      booking_date: new Date(booking_date),
    });

    try {
      await this.reservationRepository.save(reservation);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // 유니크 제약 조건에 위배되는 경우
        throw new ConflictException('이미 예약된 날짜입니다.');
      }
    }
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

  //예약목록조회
  async getReservations(
    userId: number,
    userRole: Role,
  ): Promise<getAllReservation[]> {
    // 사용자 확인
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    // 역할에 따라 예약 필터링
    let reservations: Reservation[];
    if (userRole === Role.USER) {
      reservations = await this.reservationRepository.find({
        where: { user: { id: userId } },
        relations: ['petsitter'],
        order: { created_at: 'DESC' },
      });
    } else if (userRole === Role.ADMIN) {
      reservations = await this.reservationRepository.find({
        relations: ['petsitter', 'user'],
        order: { created_at: 'DESC' },
      });
    }

    return reservations.map((reservation) => ({
      reservation_id: reservation.id,
      status: reservation.status,
      pet_details: {
        name: reservation.dog_name,
        breed: reservation.dog_breed,
        age: reservation.dog_age,
        weight: reservation.dog_weight,
        request_details: reservation.request_details,
      },
      reservation_details: {
        user_name: user.name,
        phone_number: user.phone_number,
        address: user.address,
      },
      petsitter_details: {
        name: reservation.petsitter.name,
        region: reservation.petsitter.region,
        booking_date: reservation.booking_date,
      },
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
    }));
  }

  async getReservation(
    userId: number,
    reservationId: number,
    userRole: Role,
  ): Promise<getAllReservation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['user', 'petsitter'],
    });

    if (!reservation) {
      throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
    }

    // 관리자는 모든 예약에 접근 가능, 일반 사용자는 본인의 예약만 접근 가능
    if (userRole !== Role.ADMIN && reservation.user.id !== userId) {
      throw new ForbiddenException(
        '해당 예약에 접근할 수 있는 권한이 없습니다.',
      );
    }

    return {
      reservation_id: reservation.id,
      status: reservation.status,
      pet_details: {
        name: reservation.dog_name,
        breed: reservation.dog_breed,
        age: reservation.dog_age,
        weight: reservation.dog_weight,
        request_details: reservation.request_details,
      },
      reservation_details: {
        user_name: user.name,
        phone_number: user.phone_number,
        address: user.address,
      },
      petsitter_details: {
        name: reservation.petsitter.name,
        region: reservation.petsitter.region,
        booking_date: reservation.booking_date,
      },
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
    };
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
