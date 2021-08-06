import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionService: ActionsService) {}

  @Post()
  async create(@Body() body) {
    return this.actionService.handleAction(body);
  }

  @Get('/:id')
  async find(@Param() id) {
    return this.actionService.findById(id.id);
  }
}
