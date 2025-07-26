import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @Post('initialize')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  initializeDefaultShifts() {
    return this.shiftService.initializeDefaultShifts();
  }

  @Get()
  findAll() {
    return this.shiftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftService.update(+id, updateShiftDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.shiftService.remove(+id);
  }
}