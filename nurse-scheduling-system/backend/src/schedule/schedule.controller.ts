import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleAssignmentDto } from './dto/create-schedule-assignment.dto';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  generateSchedule(@Body() generateScheduleDto: GenerateScheduleDto) {
    return this.scheduleService.generateSchedule(generateScheduleDto);
  }

  @Get()
  findScheduleByMonth(@Query('monthYear') monthYear: string) {
    return this.scheduleService.findScheduleByMonth(monthYear);
  }

  @Get('nurse/:nurseId')
  getNurseSchedule(
    @Param('nurseId') nurseId: string,
    @Query('monthYear') monthYear: string,
  ) {
    return this.scheduleService.getNurseSchedule(+nurseId, monthYear);
  }

  @Post('assignments')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  createAssignment(@Body() createScheduleAssignmentDto: CreateScheduleAssignmentDto) {
    return this.scheduleService.createAssignment(createScheduleAssignmentDto);
  }

  @Patch('assignments/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateAssignment(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateScheduleAssignmentDto>,
  ) {
    return this.scheduleService.updateAssignment(+id, updateData);
  }

  @Delete('assignments/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteAssignment(@Param('id') id: string) {
    return this.scheduleService.deleteAssignment(+id);
  }
}