import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}