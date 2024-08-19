import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class AllReservationsDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sort: SortOrder = SortOrder.DESC; // 기본값은 DESC

  @IsOptional()
  @IsString()
  userId?: string; // 사용자 ID (ADMIN의 경우 전체 목록, USER의 경우 본인 예약만 조회)
}
