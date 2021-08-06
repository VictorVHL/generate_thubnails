import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsEntity } from './entities/actions.entities';

@Module({
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
