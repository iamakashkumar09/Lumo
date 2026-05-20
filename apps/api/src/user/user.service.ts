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
    return this.addVirtualFields(userwithoutPassword as any);
  }

  private addVirtualFields(user: User): User {
    if (!user) return user;
    (user as any).stats = {
      followersCount: 120,
      followingCount: 95,
      postsCount: 12,
    };
    (user as any).lastSeenAt = new Date().toISOString();
    return user;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return this.addVirtualFields(userWithoutPassword as any);
    });
  }

  // Changed id to 'string' because you are using UUIDs
  async findOne(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return null;
    return this.addVirtualFields(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepo.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.userRepo.delete(id);
    return `User #${id} removed successfully`;
  }
}