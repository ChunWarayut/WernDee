import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  async create(createShiftDto: CreateShiftDto) {
    return this.prisma.shift.create({
      data: createShiftDto,
    });
  }

  async findAll() {
    return this.prisma.shift.findMany({
      include: {
        assignments: {
          include: {
            nurse: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            nurse: true,
          },
        },
      },
    });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    return shift;
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    const shift = await this.findOne(id);

    return this.prisma.shift.update({
      where: { id },
      data: updateShiftDto,
    });
  }

  async remove(id: number) {
    const shift = await this.findOne(id);
    return this.prisma.shift.delete({
      where: { id },
    });
  }

  async initializeDefaultShifts() {
    const existingShifts = await this.prisma.shift.count();
    
    if (existingShifts === 0) {
      const defaultShifts = [
        { name: 'เช้า', start_time: '08:00', end_time: '16:00' },
        { name: 'บ่าย', start_time: '16:00', end_time: '00:00' },
        { name: 'ดึก', start_time: '00:00', end_time: '08:00' },
      ];

      await this.prisma.shift.createMany({
        data: defaultShifts,
      });

      return { message: 'Default shifts created successfully' };
    }

    return { message: 'Shifts already exist' };
  }
}