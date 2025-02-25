import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LambdaLogsService } from '@guini/lambda-logs';
import { LambdaValidatorService } from '@guini/lambda-validator';

import { ApiOkResponse } from '@nestjs/swagger';

import User from './entity';
import Service from './service';
import { CreateDto, createSchema } from './dto/create.dto';
import UserResponse from './response';

@Controller('users')
export default class UsersController {
  constructor(
    // private lambdaResponse: LambdaResponseService,
    private logger: LambdaLogsService,
    private validator: LambdaValidatorService,
    private service: Service, // private errorHandler: ErrorHandler,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    this.logger.log(`at Controller::getAll`);

    return this.service.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async getById(@Param('id') id: string): Promise<UserResponse> {
    this.logger.log(`at Controller::getById - ${id}`);

    return this.service.getById(id);
  }

  @Post()
  async create(@Body() body: CreateDto): Promise<UserResponse> {
    this.validator.validate(body, createSchema);

    return this.service.create(body);
  }
}
