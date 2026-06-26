import { Injectable, Inject } from '@nestjs/common';
import type { IFileStorageAdapter } from './interfaces/file-storage-adapter.interface';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER') private readonly provider: IFileStorageAdapter,
  ) {}

  async uploadFileWithName(file: Buffer, name: string): Promise<string> {
    return await this.provider.upload(file, name);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const extension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${extension}`;
    
    return await this.uploadFileWithName(file.buffer, fileName);
  }
}