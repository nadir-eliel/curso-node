import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';

export class PropertyDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    nodeId: number

    
    @IsInt()
    @IsPositive()
    value: number
}