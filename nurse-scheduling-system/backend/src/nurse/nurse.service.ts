import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';

@Injectable()
export class NurseService {
  constructor(private prisma: PrismaService) {}

  async create(createNurseDto: CreateNurseDto) {
    return this.prisma.nurse.create({
      data: createNurseDto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.nurse.findMany({
      include: {
        user: true,
        schedule_assignments: {
          include: {
            shift: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const nurse = await this.prisma.nurse.findUnique({
      where: { id },
      include: {
        user: true,
        schedule_assignments: {
          include: {
            shift: true,
          },
        },
        requests_made: true,
        requests_received: true,
      },
    });

    if (!nurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }

    return nurse;
  }

  async update(id: number, updateNurseDto: UpdateNurseDto) {
    const nurse = await this.findOne(id);

    return this.prisma.nurse.update({
      where: { id },
      data: updateNurseDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    const nurse = await this.findOne(id);
    return this.prisma.nurse.delete({
      where: { id },
    });
  }

  async findAvailableNurses(date: Date, shiftId: number) {
    return this.prisma.nurse.findMany({
      where: {
        schedule_assignments: {
          none: {
            date: date,
            shift_id: shiftId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}