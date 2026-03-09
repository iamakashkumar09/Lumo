import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};

  @Post('login')
  login(@Body() loginDto:  LoginAuthDto){
    return this.authService.login(loginDto);
  }

  @Post('signup')
  signup(@Body() createUserDto:CreateUserDto){
    this.authService.signup(createUserDto);
  }
}
