import { Controller, Get } from '@nestjs/common';

@Controller("v1/users/")
export class UserController {

  @Get()
  getHello(): string {
    return "ok";
  }
}
