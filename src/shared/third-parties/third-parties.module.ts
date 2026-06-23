import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AltiriaService } from './altiria.service';
import { BoldService } from './bold.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule,HttpModule],
  controllers: [],
  providers: [AltiriaService, BoldService, NotificationService],
  exports: [AltiriaService, BoldService, NotificationService]
})
export class ThirdPartiesModule {}
