import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    userName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsArray()
    @IsOptional()
    roles?: string[];
}