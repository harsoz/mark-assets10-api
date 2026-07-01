import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetRestrictedUserDTO } from './dtos/get-restricted-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UpdateUserProjectsCapacityDTO } from './dtos/update-user-projects-capacity.dto';
import { AddProfessionalExperienceDTO } from './dtos/add-professional-experience.dto';
import { AddEducationDTO } from './dtos/add-education.dto';

@Controller('v1/users/')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('all')
  getAll() {
    return this._userService.getAll();
  }

  @Get('all/paginated')
  getAllPaginated(@Query() query: GetRestrictedUserDTO) {
    return this._userService.getAllPaginated(query);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  async create(
    @Body() request: CreateUserDTO,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
    return await this._userService.create(request, files);
  }

  @Put(':userId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  async update(
    @Body() request: UpdateUserDTO,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
    @Param('userId') userId: string,
  ) {
    return await this._userService.update(userId, request, files);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    return await this._userService.delete(userId);
  }

  @Put(':userId/projects/capacity')
  async updateUserProjectsCapacity(
    @Body() payload: UpdateUserProjectsCapacityDTO,
    @Param('userId') userId: string,
  ) {
    return await this._userService.updateUserProjectsCapacity(payload, userId);
  }

  @Post('/:userId/professional-experiences')
  async addProfessionalExperience(
    @Body() payload: AddProfessionalExperienceDTO,
    @Param('userId') userId: string,
  ) {
    return await this._userService.addProfessionalExperience(payload, userId);
  }

  @Post(':userId/education')
  async addEducation(
    @Body() payload: AddEducationDTO,
    @Param('userId') userId: string,
  ) {
    return await this._userService.addEducation(payload, userId);
  }

  @Delete('professional-experiences/:professionalExperienceId')
  async deleteProfessionalExperience(
    @Param('professionalExperienceId') professionalExperienceId: string,
  ) {
    return await this._userService.deleteProfessionalExperience(
      professionalExperienceId,
    );
  }

  @Delete('education/:educationId')
  async deleteEducation(@Param('educationId') educationId: string) {
    return await this._userService.deleteEducation(educationId);
  }
}
