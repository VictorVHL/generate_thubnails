import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { ActionsEntity } from './entities/actions.entities';


@Controller('actions')
export class ActionsController {
    constructor(
        private readonly actionService: ActionsService,
      ) {}

      
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'create meta list',
  })
  async create(
    @Body() body,
  ){
      return this.actionService.handleAction(body)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get meta for one page',
    isArray: true,
  })
  async find(@Param() id): Promise<ActionsEntity | String> {
    return this.actionService.findById(id.id)
  }
}
