import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { GetProjectDTO } from './dtos/get-project.dto';
import { plainToInstance } from 'class-transformer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectType } from 'src/domain/types/project.type';
import { CreateDTO } from './dtos/create.dto';
import type { FilesDTO } from './dtos/file.dto';
import { UpdateDTO } from './dtos/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/projects/')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string) {
    return this._projectService.getById(id);
  }

  @Get('all/:projectType')
  @HttpCode(HttpStatus.OK)
  getAll(@Param('projectType') projectType: string) {
    const request = new GetProjectDTO();
    request.projectType = projectType; // this might be removed in the future
    return this._projectService.getAll(request);
  }

  @Get('all/:projectType/user/:userId')
  @HttpCode(HttpStatus.OK)
  getAllProjectsByTypeAndUserId(
    @Param('projectType') projectType: string,
    @Param('userId') userId: string,
    @Query() query: GetProjectDTO,
  ) {
    // query gets a plain object
    const request = plainToInstance(GetProjectDTO, query);

    // override if no provided
    request.projectType = projectType; // this might be removed in the future

    return this._projectService.getAllByUserId(request, userId);
  }

  @Get('all/users/project/:projectId')
  @HttpCode(HttpStatus.OK)
  getUsersFromProject(@Param('projectId') projectId: string) {
    return this._projectService.getUsersFromProject(projectId);
  }

  @Post(':projectType/:ownerId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 20 }]))
  async create(
    @Param('ownerId') ownerId: string,
    @Param('projectType') projectType: string, // probably string
    @Body() payload: CreateDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 5MB we probably need to address the file in chunks in the future
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    files: FilesDTO, // files cannot be part of the dto in. nestjs
  ) {
    const project = payload[projectType as keyof typeof payload];

    return this._projectService.create(
      projectType as ProjectType,
      project,
      ownerId,
      files,
    );
  }

  @Put(':projectType/:ownerId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 20 }]))
  async update(
    @Param('ownerId') ownerId: string,
    @Param('projectType') projectType: string, // probably string
    @Body() payload: UpdateDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // 5MB we probably need to address the file in chunks in the future
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    files: FilesDTO, // files cannot be part of the dto in. nestjs
  ) {
    const project = payload[projectType as keyof typeof payload];

    return this._projectService.update(
      projectType as ProjectType,
      project,
      ownerId,
      files,
    );
  }
}
