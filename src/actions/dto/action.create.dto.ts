import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ActionCreateDto {
  @IsString()
  type: string;

  @IsString()
  videoId: string;

  @IsString()
  videoUrl: string;
}
