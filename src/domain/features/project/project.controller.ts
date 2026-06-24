import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { GetProjectDTO } from './dtos/get-project.dto';
import { plainToInstance } from 'class-transformer';

@Controller('v1/projects/')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
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

  @Get('all/:projectType/owner/:ownerId/count')
  @HttpCode(HttpStatus.OK)
  getProjectCountByTypeAndOwnerId(
    @Param('projectType') projectType: string,
    @Param('ownerId') ownerId: string,
  ) {
    return this._projectService.getProjectCountByTypeAndOwnerId(
      ownerId,
      projectType,
    );
  }
}
