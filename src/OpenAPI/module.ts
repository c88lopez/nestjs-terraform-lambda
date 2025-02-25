import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LambdaLogsModule } from '@guini/lambda-logs';
import { LambdaResponseModule } from '@guini/lambda-response';
import { LambdaValidatorModule } from '@guini/lambda-validator';
import { FirebaseModule } from '@guini/firebase';

import UsersController from '../users/controller';
import UsersService from '../users/service';
import User from '../users/entity';

@Module({
  imports: [
    LambdaLogsModule,
    LambdaResponseModule,
    LambdaValidatorModule,
    FirebaseModule,
  ],
  providers: [
    UsersService,
    { provide: getRepositoryToken(User), useValue: { getAll: () => {} } },
  ],
  controllers: [UsersController],
})
export default class {}
