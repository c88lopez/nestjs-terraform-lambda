import { Test, TestingModule } from '@nestjs/testing';

import { LambdaLogsModule } from '@guini/lambda-logs';
import { LambdaResponseModule } from '@guini/lambda-response';

import Service from './service';
import Controller from './controller';

describe('UsersService', () => {
  let service: Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LambdaLogsModule, LambdaResponseModule],
      providers: [Service, Controller],
    }).compile();

    service = module.get<Service>(Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
