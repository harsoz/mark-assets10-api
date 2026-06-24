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

  @Get('')
  @HttpCode(HttpStatus.OK)
  getAll(@Query() query: GetProjectDTO) {
    // query gets a plain object
    const request = plainToInstance(GetProjectDTO, query);
    if (request.isPaginated()) return this._projectService.getAll(request);
    return this._projectService.getAllProjects();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string) {
    return this._projectService.getById(id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  getAllByUserId(
    @Query() query: GetProjectDTO,
    @Param('userId') userId: string,
  ) {
    // query gets a plain object
    const request = plainToInstance(GetProjectDTO, query);
    return this._projectService.getAllByUserId(request, userId);
  }

  @Get('user/:userId/all/:projectType')
  @HttpCode(HttpStatus.OK)
  getAllProjectsByTypeAndUserId(
    @Query() query: GetProjectDTO,
    @Param('userId') userId: string,
    @Param('projectType') projectType: string,
  ) {
    // query gets a plain object
    const request = plainToInstance(GetProjectDTO, query);

    // override if no provided
    request.projectType = projectType;

    return this._projectService.getAllProjectsByTypeAndUserId(request, userId);
  }

  @Get('owner/:ownerId/all/:projectType/count')
  @HttpCode(HttpStatus.OK)
  getProjectByTypeCountByUserId(
    @Param('ownerId') ownerId: string,
    @Param('projectType') projectType: string,
  ) {
    return this._projectService.getProjectByTypeCountByOwnerId(
      ownerId,
      projectType,
    );
  }
}
