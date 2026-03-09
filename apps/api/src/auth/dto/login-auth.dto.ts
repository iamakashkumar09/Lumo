import { IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsString()
    username: string;
    @IsString()
    @MinLength(6,{message:'Password Should be atleast 6 Length'})
    password: string;
}
