import { IsDateString, IsString } from 'class-validator';

export class GenerateScheduleDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  monthYear: string; // Format: "2024-01"
}