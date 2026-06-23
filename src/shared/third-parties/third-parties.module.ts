import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AltiriaService } from './altiria.service';
import { BoldService } from './bold.service';
import { NotificationService } from './notification.service';
import { ExcelService } from './excel.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [AltiriaService, BoldService, NotificationService, ExcelService],
  exports: [AltiriaService, BoldService, NotificationService, ExcelService],
})
export class ThirdPartiesModule {}
