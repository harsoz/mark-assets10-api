import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StorageService } from 'src/shared/third-parties/storage.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/files')
@UseGuards(JwtAuthGuard) 
export class FileController {
  constructor(private readonly _storageService: StorageService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
  ) {
    return await this._storageService.uploadFile(file);
  }
}
