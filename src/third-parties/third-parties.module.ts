import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AltiriaService } from './altiria.service';
import { BoldService } from './bold.service';

@Module({
  imports: [ConfigModule,HttpModule],
  controllers: [],
  providers: [AltiriaService, BoldService],
  exports: [AltiriaService, BoldService]
})
export class ThirdPartiesModule {}
