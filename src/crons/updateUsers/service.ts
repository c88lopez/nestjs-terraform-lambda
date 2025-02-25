import { Injectable } from '@nestjs/common';
import { LambdaLogsService } from '@guini/lambda-logs';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import User from '../../users/entity';

@Injectable()
export default class {
  constructor(
    private logger: LambdaLogsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async process(): Promise<User[]> {
    this.logger.log(`at Service::process`);

    return this.usersRepository.find();
  }
}
