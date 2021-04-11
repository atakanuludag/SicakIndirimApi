import { IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';

export class UpdateHotDealDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    shortDescription: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsDateString()
    @IsOptional()
    dueDate: string;

    @IsUrl()
    @IsOptional()
    url: string;
}