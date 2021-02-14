import { IsString } from 'class-validator';

export class ParamsDto {
    @IsString()
    id: string;
}