import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { CreateOrUpdateFieldDTO } from './dtos/create-or-update-dynamic-field.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/dynamic-fields')
@UseGuards(JwtAuthGuard)
export class DynamicFieldController {
  constructor(private readonly _dynamicFieldsService: DynamicFieldService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this._dynamicFieldsService.getAll();
  }

  @Get('all/user/:id')
  @HttpCode(HttpStatus.OK)
  async getUserDynamicFields(@Param('id') id: string) {
    return await this._dynamicFieldsService.getUserDynamicFields(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateOrUpdateFieldDTO) {
    return await this._dynamicFieldsService.create(request);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() request: CreateOrUpdateFieldDTO,
    @Param('id') id: number,
  ) {
    return await this._dynamicFieldsService.update(request, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return await this._dynamicFieldsService.delete(id);
  }
}
