import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import Module from '../../src/users/module';
import UsersController from '../../src/users/controller';
import getAPIGatewayV2Payload from '../getAPIGatewayV2Payload';
import { ClientError } from '@guini/lambda-validator/errors/clientError';
import { DataSource } from 'typeorm';
import User from '../../src/users/entity';

describe('Users', () => {
  let app: INestApplication;
  let controller: UsersController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [Module],
    }).compile();

    app = moduleRef.createNestApplication();

    controller = app.get(UsersController);
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);

    await dataSource.createQueryBuilder().delete().from(User).execute();

    await app.close();
  });

  describe('Validations', () => {
    it('should fail on missing "email" field', async () => {
      const createEvent = getAPIGatewayV2Payload({
        routeKey: 'POST /users',
        body: JSON.stringify({ missing: 'email' }),
      });

      const createResult = await controller.handleRequest(createEvent);

      const parsedCreateResponse = JSON.parse(
        Buffer.from(createResult.body, 'base64').toString(),
      );

      expect(parsedCreateResponse).toHaveProperty(
        'error.message',
        new ClientError('"email" is required').message,
      );
      expect(createResult).toHaveProperty('statusCode', 400);
    });

    it('should fail on duplicate "email"', async () => {
      await controller.handleRequest(
        getAPIGatewayV2Payload({
          routeKey: 'POST /users',
          body: JSON.stringify({ email: 'email@valid.com' }),
        }),
      );

      const badCreateResult = await controller.handleRequest(
        getAPIGatewayV2Payload({
          routeKey: 'POST /users',
          body: JSON.stringify({ email: 'email@valid.com' }),
        }),
      );

      const parsedBadCreateResponse = JSON.parse(
        Buffer.from(badCreateResult.body, 'base64').toString(),
      );

      expect(parsedBadCreateResponse).toHaveProperty(
        'error.message',
        new ClientError('Duplicated email').message,
      );
      expect(badCreateResult).toHaveProperty('statusCode', 400);
    }, 30000);
  });
});
