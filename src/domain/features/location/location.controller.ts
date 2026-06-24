import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller("v1/locations/")
export class LocationController {

  constructor(private readonly _locationService: LocationService) {}

  // countries
  @Get("countries")
  getCountries() {
    return this._locationService.getAllCountries();
  }

  @Get("countries/:countryId/states")
  getStatesByCountryId(@Param('countryId', ParseIntPipe) countryId: number) {
    return this._locationService.getStates(countryId);
  }

  // states
  @Get("states/:stateId/cities")
  getCitiesByStateId(@Param('stateId', ParseIntPipe) stateId: number) {
    return this._locationService.getCities(stateId);
  }

  // cities
}
