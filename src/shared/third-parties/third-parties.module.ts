import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AltiriaService } from './altiria.service';
import { BoldService } from './bold.service';
import { NotificationService } from './notification.service';
import { ExcelService } from './excel.service';
import { StorageService } from './storage.service';
import { FileStorageAdapter } from './adapters/file-storage.adapter';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [
    AltiriaService,
    BoldService,
    NotificationService,
    ExcelService,
    StorageService,
    {
      provide: 'STORAGE_PROVIDER',
      useClass: FileStorageAdapter
        // process.env.USE_S3 === 'true' ? S3StorageAdapter : LocalStorageAdapter,
    },
  ],
  exports: [AltiriaService, BoldService, NotificationService, ExcelService, StorageService],
})
export class ThirdPartiesModule {}
