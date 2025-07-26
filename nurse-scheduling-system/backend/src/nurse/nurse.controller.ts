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
import { NurseService } from './nurse.service';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('nurses')
@UseGuards(JwtAuthGuard)
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createNurseDto: CreateNurseDto) {
    return this.nurseService.create(createNurseDto);
  }

  @Get()
  findAll() {
    return this.nurseService.findAll();
  }

  @Get('available')
  findAvailable(@Query('date') date: string, @Query('shiftId') shiftId: string) {
    return this.nurseService.findAvailableNurses(new Date(date), +shiftId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    return this.nurseService.update(+id, updateNurseDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.nurseService.remove(+id);
  }
}