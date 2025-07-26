import { IsDateString, IsInt } from 'class-validator';

export class CreateScheduleAssignmentDto {
  @IsDateString()
  date: string;

  @IsInt()
  nurse_id: number;

  @IsInt()
  shift_id: number;
}