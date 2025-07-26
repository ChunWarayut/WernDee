import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CreateShiftExchangeRequestDto } from './dto/create-shift-exchange-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('leave')
  createLeaveRequest(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.requestService.createLeaveRequest(createLeaveRequestDto);
  }

  @Post('shift-exchange')
  createShiftExchangeRequest(@Body() createShiftExchangeRequestDto: CreateShiftExchangeRequestDto) {
    return this.requestService.createShiftExchangeRequest(createShiftExchangeRequestDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.requestService.findAll();
  }

  @Get('my-requests')
  findMyRequests(@Request() req) {
    return this.requestService.findByNurse(req.user.nurse_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateRequestStatusDto: UpdateRequestStatusDto) {
    return this.requestService.updateStatus(+id, updateRequestStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}