import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  CancelReservation,
  UpdateReservationDto,
  UpdateStatusDTO,
} from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataSource, Not, QueryFailedError, Repository } from 'typeorm';
import { Petsitter } from 'src/petsitter/entities/petsitter.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/types/user-role.type';
import {
  bookingReservation,
  changeStatus,
  getAllReservation,
} from './dto/reservation-res.dto';
import { Status } from './types/reservation-status.type';
import { ReservationLog } from 'src/reservation-logs/entities/reservation-log.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Petsitter)
    private readonly petsitterRepository: Repository<Petsitter>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ReservationLog)
    private readonly reservationLogRepository: Repository<ReservationLog>,
    // private readonly connection: Connection,
    private readonly dataSource: DataSource,
  ) {}
  //예약
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
        user_name: reservation.user.name,
        phone_number: reservation.user.phone_number,
        address: reservation.user.address,
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

  //예약정보변경
  async updateReservation(
    userId: number,
    reservationId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    //: Promise<getAllReservation>
    const {
      dog_name,
      dog_breed,
      dog_age,
      dog_weight,
      request_details,
      booking_date,
    } = updateReservationDto;

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

    // 사용자는 자신의 예약만 수정 가능
    if (reservation.user.id !== userId) {
      throw new ForbiddenException(
        '해당 예약에 접근할 수 있는 권한이 없습니다.',
      );
    }

    // 예약 정보 업데이트
    if (dog_name) reservation.dog_name = updateReservationDto.dog_name;
    if (dog_breed) reservation.dog_breed = updateReservationDto.dog_breed;
    if (dog_age) reservation.dog_age = updateReservationDto.dog_age;
    if (dog_weight) reservation.dog_weight = updateReservationDto.dog_weight;
    if (request_details)
      reservation.request_details = updateReservationDto.request_details;
    if (booking_date)
      reservation.booking_date = new Date(updateReservationDto.booking_date);

    // 중복된 예약 날짜가 있는지 확인
    const existingReservation = await this.reservationRepository.findOne({
      where: {
        petsitter: reservation.petsitter,
        booking_date: reservation.booking_date,
        id: Not(reservationId),
      },
    });

    if (existingReservation) {
      throw new ConflictException('해당 날짜에 이미 예약이 있습니다.');
    }
    // 예약 정보 저장 및 updated_at 자동 업데이트
    try {
      await this.reservationRepository.save(reservation);
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
    } catch (error) {
      // 중복 제약 조건 에러 처리
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('해당 날짜에 이미 예약이 있습니다.');
      }
      throw error;
    }
  }

  //예약취소
  async cancelReservation(
    userId: number,
    reservationId: number,
    cancelReservation: CancelReservation,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 예약 조회
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { id: reservationId },
        relations: ['user'],
      });

      if (!reservation) {
        throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
      }

      // 사용자는 자신의 예약만 취소 가능
      if (reservation.user.id !== userId) {
        throw new ForbiddenException(
          '해당 예약에 접근할 수 있는 권한이 없습니다.',
        );
      }
      // 현재 상태 저장
      const old_status = reservation.status;

      //예약상태 취소
      reservation.status = Status.CANCELED; // Enum으로 상태를 정의

      // 어제 날짜로 설정
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      reservation.booking_date = yesterday;
      //취소시 예약날짜 어제로 기록.상태 취소
      await queryRunner.manager.save(reservation);

      // 로그 기록
      const reservationLog = this.reservationLogRepository.create({
        reservation,
        user: reservation.user,
        old_status,
        new_status: reservation.status,
        reason: cancelReservation.reason,
      });
      await queryRunner.manager.save(reservationLog);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('예약 취소 처리 중 오류가 발생했습니다.');
    } finally {
      // 쿼리러너 해제
      await queryRunner.release();
    }
  }

  //예약상태변경
  async updateReservationStatus(
    reservationId: number,
    updateStatusDTO: UpdateStatusDTO,
    userId: number,
  ): Promise<changeStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['user', 'petsitter'],
      });

      if (!reservation) {
        throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
      }

      const { new_status, reason } = updateStatusDTO;
      const old_status = reservation.status;

      // 상태 변경
      reservation.status = new_status;
      await queryRunner.manager.save(reservation);

      // 로그 기록
      const reservationLog = this.reservationLogRepository.create({
        reservation,
        user: reservation.user,
        old_status,
        new_status,
        reason,
      });

      await queryRunner.manager.save(reservationLog);

      await queryRunner.commitTransaction();

      return {
        reservation_id: reservation.id,
        user_id: reservation.user.id,
        petsitter_id: reservation.petsitter.id,
        pet_details: {
          dog_name: reservation.dog_name,
          dog_breed: reservation.dog_breed,
          dog_age: reservation.dog_age,
          dog_weight: reservation.dog_weight,
        },
        updated_status: {
          old_status,
          new_status,
          reason,
        },
        booking_date: reservation.booking_date,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
