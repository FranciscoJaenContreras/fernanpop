import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuardGuard } from './guards/user-guard/auth-guard.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuardGuard)
  @Get()
  findAll(@Request() req: Request) {
    console.log(req);
    return this.authService.findAll();
  }

  @UseGuards(AuthGuardGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(AuthGuardGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateuserDto: UpdateAuthDto) {
    return this.authService.update(id, updateuserDto);
  }

  @UseGuards(AuthGuardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Get('/check-token/:token')
  check(@Param('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    return this.authService.checkToken(token);
  }
}
