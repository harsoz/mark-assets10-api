import { Controller, Get } from '@nestjs/common';

@Controller("v1/user/")
export class UserController {

  @Get()
  getHello(): string {
    return "ok";
  }
}
