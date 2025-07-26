import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class ShiftModule {}