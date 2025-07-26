import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @IsInt()
  @IsOptional()
  approved_by_id?: number;
}