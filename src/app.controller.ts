import { Controller, Get } from '@nestjs/common';

@Controller("v1/health/")
export class AppController {

  @Get()
  getHello(): string {
    return "ok";
  }
}
