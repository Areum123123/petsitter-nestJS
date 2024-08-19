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
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/auth/dto/req-user.dto';
import { GetReservationDto } from './dto/reservation-res.dto';
import { Role } from 'src/user/types/user-role.type';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //예약생성
  @Post()
  @UseGuards(AuthGuard())
  async reservationCreate(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: CustomRequest,
  ): Promise<GetReservationDto> {
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
  async getReservations(@Req() req: CustomRequest): Promise<GetReservationDto> {
    const userId = req.user.id;
    const userRole: Role = req.user.role as Role;
    const reservations = await this.reservationService.getReservations(
      userId,
      userRole,
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
  ): Promise<GetReservationDto> {
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
  ): Promise<GetReservationDto> {
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
