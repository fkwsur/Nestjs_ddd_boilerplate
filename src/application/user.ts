import { Controller, Get, Param, Query, Req , Headers, Post, Body} from '@nestjs/common';
import { User } from 'src/domain/user';
import { Service } from '../service';
import * as r from "./response";

@Controller("api/v1/user")
export class UserController {
  constructor(
    private readonly svc: Service
    ) {}

  @Post("/signup")
  async SignUp(@Body() req : User.UserDTO): Promise<any>  {
   try {
     await this.svc.userService.SignUp(req);
     return r.Result(0);
   } catch (error) {
    return r.Error(error);
   }
  }

  @Post("/signin")
  async SignIn(@Body() req : User.UserDTO): Promise<any>  {
   try {
    return await this.svc.userService.SignIn(req);
   } catch (error) {
    return r.Error(error);
   }
  }



}
