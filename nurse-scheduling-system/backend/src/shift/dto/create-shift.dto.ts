import { IsString } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  name: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;
}