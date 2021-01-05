import { IsNotEmpty, IsString, IsUrl, IsDateString } from 'class-validator';

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

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsDateString()
    dueDate: string;

    @IsUrl()
    url: string;
}