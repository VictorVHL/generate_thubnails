import { Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, Unique } from 'typeorm';
import { IsString } from 'class-validator';

@Entity('actions')
export class ActionsEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @IsString()
    @Column({ type: 'varchar', length: 255 })
    status: string;
}