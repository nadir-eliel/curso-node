import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator'

export class NodeDto {
  @IsString()
  @IsNotEmpty()
    name: string

  @IsInt()
  @IsPositive()
  @IsOptional()
    parentId: number
}
