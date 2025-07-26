import { IsInt } from 'class-validator';

export class CreateShiftExchangeRequestDto {
  @IsInt()
  requester_id: number;

  @IsInt()
  target_nurse_id: number;

  @IsInt()
  source_assignment_id: number;

  @IsInt()
  target_assignment_id: number;
}