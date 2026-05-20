import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password is too small' })
    password: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;
}
