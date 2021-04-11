import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {

    @IsString()
    @IsOptional()
    comment: string;

    @IsString()
    @IsOptional()
    hotDeal: string;
}