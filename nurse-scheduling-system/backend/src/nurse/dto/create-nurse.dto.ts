import { IsString, IsEnum } from 'class-validator';
import { Qualification, SpecialCondition } from '@prisma/client';

export class CreateNurseDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(Qualification)
  qualification: Qualification;

  @IsEnum(SpecialCondition)
  special_condition: SpecialCondition;
}