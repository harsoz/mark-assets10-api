import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards 
} from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { CreateOrUpdateFieldDTO } from './dtos/create-or-update-dynamic-field.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ajusta según tu estrategia de auth

@Controller('api/dynamic-fields')
// @UseGuards(JwtAuthGuard) // Equivale al [Authorize] global del controlador
export class DynamicFieldController {
  constructor(private readonly _dynamicFieldsService: DynamicFieldService) {}

//   @Get('GetProfiles')
//   async getProfiles() {
//     return await this._dynamicFieldsService.getProfiles();
//   }

  @Get('all')
  async getAll() {
    return await this._dynamicFieldsService.getAll();
  }

  @Get('all/user/:id')
  async getUserDynamicFields(@Param('id') id: string) {
    return await this._dynamicFieldsService.getUserDynamicFields(id);
  }

  @Post()
  async create(@Body() request: CreateOrUpdateFieldDTO) {
    return await this._dynamicFieldsService.create(request);
  }

  @Put(':id')
  async update(@Body() request: CreateOrUpdateFieldDTO, @Param('id') id: number) {
    return await this._dynamicFieldsService.update(request, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this._dynamicFieldsService.delete(id);
  }
}