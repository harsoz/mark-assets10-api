import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/locations/')
@UseGuards(JwtAuthGuard) 
export class LocationController {
  constructor(private readonly _locationService: LocationService) {}

  @Get('countries')
  @HttpCode(HttpStatus.OK)
  getCountries() {
    return this._locationService.getAllCountries();
  }

  @Get('countries/:countryId/states')
  @HttpCode(HttpStatus.OK)
  getStatesByCountryId(@Param('countryId', ParseIntPipe) countryId: number) {
    return this._locationService.getStatesByCountryId(countryId);
  }

  @Get('states/:stateId/cities')
  @HttpCode(HttpStatus.OK)
  getCitiesByStateId(@Param('stateId', ParseIntPipe) stateId: number) {
    return this._locationService.getCitiesByStateId(stateId);
  }
}
