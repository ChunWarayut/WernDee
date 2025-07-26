import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CreateShiftExchangeRequestDto } from './dto/create-shift-exchange-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestType, RequestStatus } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async createLeaveRequest(createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.prisma.request.create({
      data: {
        request_type: RequestType.LEAVE,
        status: RequestStatus.PENDING_ADMIN_APPROVAL,
        requester_id: createLeaveRequestDto.requester_id,
        leave_start_date: new Date(createLeaveRequestDto.leave_start_date),
        leave_end_date: new Date(createLeaveRequestDto.leave_end_date),
      },
      include: {
        requester: true,
      },
    });
  }

  async createShiftExchangeRequest(createShiftExchangeRequestDto: CreateShiftExchangeRequestDto) {
    const { requester_id, target_nurse_id, source_assignment_id, target_assignment_id } = createShiftExchangeRequestDto;

    // Verify assignments exist and belong to the correct nurses
    const sourceAssignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id: source_assignment_id },
      include: { nurse: true, shift: true },
    });

    const targetAssignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id: target_assignment_id },
      include: { nurse: true, shift: true },
    });

    if (!sourceAssignment || !targetAssignment) {
      throw new NotFoundException('One or both assignments not found');
    }

    if (sourceAssignment.nurse_id !== requester_id) {
      throw new BadRequestException('Source assignment does not belong to requester');
    }

    if (targetAssignment.nurse_id !== target_nurse_id) {
      throw new BadRequestException('Target assignment does not belong to target nurse');
    }

    return this.prisma.request.create({
      data: {
        request_type: RequestType.SHIFT_EXCHANGE,
        status: RequestStatus.PENDING_PEER_APPROVAL,
        requester_id,
        target_nurse_id,
        source_assignment_id,
        target_assignment_id,
      },
      include: {
        requester: true,
        target_nurse: true,
        source_assignment: {
          include: { shift: true },
        },
        target_assignment: {
          include: { shift: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        requester: true,
        target_nurse: true,
        source_assignment: {
          include: { shift: true },
        },
        target_assignment: {
          include: { shift: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByNurse(nurseId: number) {
    return this.prisma.request.findMany({
      where: {
        OR: [
          { requester_id: nurseId },
          { target_nurse_id: nurseId },
        ],
      },
      include: {
        requester: true,
        target_nurse: true,
        source_assignment: {
          include: { shift: true },
        },
        target_assignment: {
          include: { shift: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        requester: true,
        target_nurse: true,
        source_assignment: {
          include: { shift: true },
        },
        target_assignment: {
          include: { shift: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async updateStatus(id: number, updateRequestStatusDto: UpdateRequestStatusDto) {
    const request = await this.findOne(id);
    const { status, approved_by_id } = updateRequestStatusDto;

    // Handle shift exchange approval logic
    if (request.request_type === RequestType.SHIFT_EXCHANGE && status === RequestStatus.APPROVED) {
      // If peer approval and it's currently pending peer approval
      if (request.status === RequestStatus.PENDING_PEER_APPROVAL) {
        return this.prisma.request.update({
          where: { id },
          data: {
            status: RequestStatus.PENDING_ADMIN_APPROVAL,
          },
          include: {
            requester: true,
            target_nurse: true,
            source_assignment: {
              include: { shift: true },
            },
            target_assignment: {
              include: { shift: true },
            },
          },
        });
      }
      
      // If admin approval and it's pending admin approval
      if (request.status === RequestStatus.PENDING_ADMIN_APPROVAL) {
        // Perform the shift exchange
        await this.performShiftExchange(request.source_assignment_id!, request.target_assignment_id!);
      }
    }

    return this.prisma.request.update({
      where: { id },
      data: {
        status,
      },
      include: {
        requester: true,
        target_nurse: true,
        source_assignment: {
          include: { shift: true },
        },
        target_assignment: {
          include: { shift: true },
        },
      },
    });
  }

  private async performShiftExchange(sourceAssignmentId: number, targetAssignmentId: number) {
    const sourceAssignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id: sourceAssignmentId },
    });

    const targetAssignment = await this.prisma.scheduleAssignment.findUnique({
      where: { id: targetAssignmentId },
    });

    if (!sourceAssignment || !targetAssignment) {
      throw new NotFoundException('Assignments not found for exchange');
    }

    // Swap the nurse assignments
    await this.prisma.scheduleAssignment.update({
      where: { id: sourceAssignmentId },
      data: {
        nurse_id: targetAssignment.nurse_id,
      },
    });

    await this.prisma.scheduleAssignment.update({
      where: { id: targetAssignmentId },
      data: {
        nurse_id: sourceAssignment.nurse_id,
      },
    });
  }

  async remove(id: number) {
    const request = await this.findOne(id);
    return this.prisma.request.delete({
      where: { id },
    });
  }
}