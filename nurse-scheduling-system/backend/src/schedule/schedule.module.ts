import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NurseModule } from '../nurse/nurse.module';

@Module({
  imports: [PrismaModule, NurseModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}