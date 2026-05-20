import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  async login(loginDto: LoginAuthDto) {
    const user = await this.userService.login(loginDto);
    
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    
    return {
      access_token: accessToken,
      user,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }
}
