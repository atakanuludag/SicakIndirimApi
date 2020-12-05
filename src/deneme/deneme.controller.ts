import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards  } from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller()
export class DenemeController {
  constructor(

  ) {}



  @UseGuards(JwtAuthGuard)
  @Get('deneme')
  async login() {
    return {"deneme": true}
  }
  


  
}
