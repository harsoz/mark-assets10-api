import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { StorageService } from 'src/shared/third-parties/storage.service';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ajusta la ruta según tu estructura

@Controller('v1/files')
export class FileController {
  constructor(private readonly _storageService: StorageService) {}

  @Post()
  async post(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 5MB we probably need to address the file in chunks in the future
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    return await this._storageService.uploadFile(file);
  }
}
