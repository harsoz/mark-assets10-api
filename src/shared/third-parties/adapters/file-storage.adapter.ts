import { writeFile } from 'fs/promises';
import { join } from 'path';
import { IFileStorageAdapter } from '../interfaces/file-storage-adapter.interface';

// we should work on this later
export class FileStorageAdapter implements IFileStorageAdapter {
  private readonly uploadPath = './uploads';

  async upload(file: Buffer, name: string): Promise<string> {
    const filePath = join(this.uploadPath, name);
    await writeFile(filePath, file);
    return filePath; // O la URL pública
  }

  async delete(name: string): Promise<void> {
    // Lógica para fs.unlink
  }
}