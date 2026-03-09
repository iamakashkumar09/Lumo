import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';

@Injectable()
export class UserService {
  // Use lowercase 'userRepo' for naming convention
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      // We MUST use 'await' here
      const newUser = await this.userRepo.create(createUserDto);
      await this.userRepo.save(newUser);
      return newUser; // Return the actual user object (standard practice)
    } catch (error) {
      // Handle duplicate email/username errors (Postgres error 23505)
      if (error.code === '23505') {
        throw new ConflictException('Email or Username already exists');
      }
      throw error;
    }
  }

  async login(loginAuthDto: LoginAuthDto){
    const user= await this.userRepo.findOneBy({username: loginAuthDto.username});
    
    if(!user){
      throw new UnauthorizedException('Invalid Credentials!');
    }
    const isPassword=await bcrypt.compare(loginAuthDto.password,user.password);

    if(!isPassword){
      throw new UnauthorizedException('Invalid Credentials!');
    }

    // we need to return the user without password as security concerns

    const {password, ...userwithoutPassword}=user;
    return userwithoutPassword;
  }

  async findAll() {
    return await this.userRepo.find();
  }

  // Changed id to 'string' because you are using UUIDs
  async findOne(id: string) {
    return await this.userRepo.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto);
    return `User #${id} updated successfully`;
  }

  async remove(id: string) {
    await this.userRepo.delete(id);
    return `User #${id} removed successfully`;
  }
}