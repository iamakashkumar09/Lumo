import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  
  login(loginDto: LoginAuthDto){
    return this.userService.login(loginDto);
  }

  signup(createUserDto:CreateUserDto){
    return this.userService.signup(createUserDto);
  }
}
