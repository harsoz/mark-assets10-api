import { Controller, Get } from '@nestjs/common';

@Controller("v1/role/")
export class RoleController {

  @Get()
  getHello(): string {
    return "ok";
  }
}
