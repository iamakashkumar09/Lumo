import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    // @IsString()
    // name:string;
    @IsString()
    username:string;
    @IsEmail()
    email:string;
    @IsString()
    @MinLength(6,{message:'Password is too small'})
    password:string;
}
