import { Injectable } from '@nestjs/common';
import { LambdaLogsService } from '@guini/lambda-logs';

import User from './entity';
import { CreateDto } from './dto/create.dto';
import { FirebaseService } from '@guini/firebase';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from '@rentcheck/types';

@Injectable()
export default class UsersService {
  constructor(
    private logger: LambdaLogsService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private firebaseService: FirebaseService,
  ) {}

  async getAll(): Promise<User[]> {
    this.logger.log(`at Service::getAll`);

    return this.usersRepository.find();
  }

  async getById(id: string): Promise<Profile> {
    this.logger.log(`at Service::getById`);

    // return this.usersRepository.findOneByOrFail({ id });

    return this.firebaseService.getById(id);
  }

  async create(dto: CreateDto): Promise<User> {
    const user = new User();

    user.email = dto.email;

    return this.usersRepository.save(user);
  }
}
