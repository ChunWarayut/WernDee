import { IsDateString, IsInt } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsInt()
  requester_id: number;

  @IsDateString()
  leave_start_date: string;

  @IsDateString()
  leave_end_date: string;
}