import { Module } from '@nestjs/common';
import { NurseService } from './nurse.service';
import { NurseController } from './nurse.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NurseController],
  providers: [NurseService],
  exports: [NurseService],
})
export class NurseModule {}