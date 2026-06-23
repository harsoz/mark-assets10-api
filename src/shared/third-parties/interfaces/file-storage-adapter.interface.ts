export interface IFileStorageAdapter {
  upload(file: Buffer, name: string): Promise<string>;
  delete(name: string): Promise<void>;
}