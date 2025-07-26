import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NurseModule } from './nurse/nurse.module';
import { ShiftModule } from './shift/shift.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RequestModule } from './request/request.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    NurseModule,
    ShiftModule,
    ScheduleModule,
    RequestModule,
  ],
})
export class AppModule {}
