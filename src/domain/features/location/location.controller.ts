import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller("v1/locations/")
export class LocationController {

  constructor(private readonly _locationService: LocationService) {}

  // countries
  @Get("countries")
  @HttpCode(HttpStatus.OK)
  getCountries() {
    return this._locationService.getAllCountries();
  }

  @Get("countries/:countryId/states")
  @HttpCode(HttpStatus.OK)
  getStatesByCountryId(@Param('countryId', ParseIntPipe) countryId: number) {
    return this._locationService.getStatesByCountryId(countryId);
  }

  // states
  @Get("states/:stateId/cities")
  @HttpCode(HttpStatus.OK)
  getCitiesByStateId(@Param('stateId', ParseIntPipe) stateId: number) {
    return this._locationService.getCitiesByStateId(stateId);
  }

}
