import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleAssignmentDto } from './dto/create-schedule-assignment.dto';
import { GenerateScheduleDto } from './dto/generate-schedule.dto';
import { AssignmentType } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async generateSchedule(generateScheduleDto: GenerateScheduleDto) {
    const { startDate, endDate, monthYear } = generateScheduleDto;
    
    // Clear existing automated assignments for the period
    await this.prisma.scheduleAssignment.deleteMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        assignment_type: AssignmentType.AUTOMATED,
      },
    });

    // Get all nurses
    const nurses = await this.prisma.nurse.findMany();
    
    // Get all shifts
    const shifts = await this.prisma.shift.findMany();

    // Get schedule rules
    const rules = await this.prisma.scheduleRule.findMany();
    const minNursesPerShift = rules[0]?.min_nurses_per_shift || 2;

    // Simple round-robin scheduling algorithm
    const assignments = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      for (const shift of shifts) {
        // Assign nurses to this shift in round-robin fashion
        const availableNurses = nurses.slice(); // Copy array
        const assignedNurses = [];
        
        for (let i = 0; i < minNursesPerShift && availableNurses.length > 0; i++) {
          const nurseIndex = i % availableNurses.length;
          const nurse = availableNurses[nurseIndex];
          
          assignments.push({
            date: new Date(d),
            nurse_id: nurse.id,
            shift_id: shift.id,
            assignment_type: AssignmentType.AUTOMATED,
          });
          
          assignedNurses.push(nurse);
          availableNurses.splice(nurseIndex, 1);
        }
      }
    }

    // Create assignments in database
    await this.prisma.scheduleAssignment.createMany({
      data: assignments,
    });

    return { 
      message: 'Schedule generated successfully',
      assignmentsCount: assignments.length 
    };
  }

  async findScheduleByMonth(monthYear: string) {
    const year = parseInt(monthYear.split('-')[0]);
    const month = parseInt(monthYear.split('-')[1]);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.scheduleAssignment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        nurse: true,
        shift: true,
      },
      orderBy: [
        { date: 'asc' },
        { shift_id: 'asc' },
      ],
    });
  }

  async createAssignment(createScheduleAssignmentDto: CreateScheduleAssignmentDto) {
    // Check if nurse already has assignment for this date
    const existingAssignment = await this.prisma.scheduleAssignment.findUnique({
      where: {
        OneShiftPerDayPerNurse: {
          date: new Date(createScheduleAssignmentDto.date),
          nurse_id: createScheduleAssignmentDto.nurse_id,
        },
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('Nurse already has an assignment for this date');
    }

    return this.prisma.scheduleAssignment.create({
      data: {
        ...createScheduleAssignmentDto,
        date: new Date(createScheduleAssignmentDto.date),
        assignment_type: AssignmentType.MANUAL_SWAP,
      },
      include: {
        nurse: true,
        shift: true,
      },
    });
  }

  async updateAssignment(id: number, updateData: Partial<CreateScheduleAssignmentDto>) {
    const assignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Schedule assignment with ID ${id} not found`);
    }

    return this.prisma.scheduleAssignment.update({
      where: { id },
      data: {
        ...updateData,
        date: updateData.date ? new Date(updateData.date) : undefined,
        assignment_type: AssignmentType.MANUAL_SWAP,
      },
      include: {
        nurse: true,
        shift: true,
      },
    });
  }

  async deleteAssignment(id: number) {
    const assignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Schedule assignment with ID ${id} not found`);
    }

    return this.prisma.scheduleAssignment.delete({
      where: { id },
    });
  }

  async getNurseSchedule(nurseId: number, monthYear: string) {
    const year = parseInt(monthYear.split('-')[0]);
    const month = parseInt(monthYear.split('-')[1]);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.prisma.scheduleAssignment.findMany({
      where: {
        nurse_id: nurseId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        shift: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}