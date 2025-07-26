import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsInt()
  @IsOptional()
  nurse_id?: number;
}