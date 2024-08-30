import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  CancelReservation,
  UpdateReservationDto,
  UpdateStatusDTO,
} from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { cancelReservation, GetReservation } from './dto/reservation-res.dto';
import { Role } from 'src/user/types/user-role.type';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Status } from './types/reservation-status.type';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //예약생성
  @Post()
  @UseGuards(AuthGuard())
  async reservationCreate(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: CustomRequest,
  ): Promise<GetReservation> {
    const userId = req.user.id;

    const result = await this.reservationService.bookingCreate(
      userId,
      createReservationDto,
    );

    return {
      status: 201,
      message: '예약이 접수 되었습니다. 펫시터의 승인을 기다리고 있습니다.',
      data: result,
    };
  }

  //예약목록조회
  @Get()
  @UseGuards(AuthGuard())
  async getReservations(
    @Req() req: CustomRequest,
    @Query('status') status?: Status,
  ): Promise<GetReservation> {
    const userId = req.user.id;
    const userRole: Role = req.user.role as Role;
    const reservations = await this.reservationService.getReservations(
      userId,
      userRole,
      status,
    );

    return {
      status: 200,
      message: '예약 조회에 성공했습니다.',
      data: reservations,
    };
  }

  //예약상세조회
  @Get(':reservationId')
  @UseGuards(AuthGuard())
  async getReservation(
    @Param('reservationId') reservationId: number,
    @Req() req: CustomRequest,
  ): Promise<GetReservation> {
    const userId = req.user.id;
    const userRole: Role = req.user.role as Role;
    const reservation = await this.reservationService.getReservation(
      userId,
      reservationId,
      userRole,
    );

    return {
      status: 200,
      message: '예약 조회에 성공했습니다.',
      data: reservation,
    };
  }
  //예약정보변경

  @Patch(':reservationId')
  @UseGuards(AuthGuard())
  async update(
    @Param('reservationId') reservationId: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @Req() req: CustomRequest,
  ): Promise<GetReservation> {
    const userId = req.user.id;

    const updatedReservation = await this.reservationService.updateReservation(
      userId,
      reservationId,
      updateReservationDto,
    );

    return {
      status: 200,
      message: '예약 수정에 성공했습니다.',
      data: updatedReservation,
    };
  }

  //예약취소
  @Delete(':reservationId')
  @UseGuards(AuthGuard())
  async cancelReservation(
    @Param('reservationId') reservationId: number,
    @Body() cancelReservation: CancelReservation,
    @Req() req: CustomRequest,
  ): Promise<cancelReservation> {
    const userId = req.user.id;
    const result = await this.reservationService.cancelReservation(
      userId,
      reservationId,
      cancelReservation,
    );

    return {
      status: 200,
      message: '예약이 성공적으로 취소되었습니다.',
      Id: `${reservationId}`,
    };
  }

  //예약상태변경 (관리자)
  @Patch(':reservationId/status')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async updateReservationStatus(
    @Param('reservationId') reservationId: number,
    @Body() updateStatusDTO: UpdateStatusDTO,
    @Req() req: CustomRequest,
  ): Promise<GetReservation> {
    const userId = req.user.id;

    const result = await this.reservationService.updateReservationStatus(
      reservationId,
      updateStatusDTO,
      userId,
    );

    return {
      status: 200,
      message: '예약 상태가 성공적으로 변경되었습니다.',
      data: result,
    };
  }
}
