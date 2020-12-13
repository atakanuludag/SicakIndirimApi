import { IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';

export class CreateHotDealDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    shortDescription: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsUrl()
    url: string;
}