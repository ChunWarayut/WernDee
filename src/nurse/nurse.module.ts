import { Module } from '@nestjs/common';
import { NurseService } from './nurse.service';
import { NurseController } from './nurse.controller';

@Module({
  providers: [NurseService],
  controllers: [NurseController],
  exports: [NurseService],
})
export class NurseModule {}