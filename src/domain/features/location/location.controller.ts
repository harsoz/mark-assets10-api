import { Controller, Get } from '@nestjs/common';

@Controller("v1/location/")
export class LocationController {

  @Get()
  getHello(): string {
    return "ok";
  }
}
