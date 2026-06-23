import { Injectable, Inject } from '@nestjs/common';
import type { IFileStorageAdapter } from './interfaces/file-storage-adapter.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER') private readonly provider: IFileStorageAdapter,
  ) {}

  async uploadFile(file: Buffer, name: string): Promise<string> {
    return await this.provider.upload(file, name);
  }
}