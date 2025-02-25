import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import Module from '../../src/users/module';
import UsersController from '../../src/users/controller';
import getAPIGatewayV2Payload from '../getAPIGatewayV2Payload';
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

  describe('Basic CRUD flow', () => {
    const createUserPayload = { email: 'account-name@domain.com' };

    const createEvent = getAPIGatewayV2Payload({
      routeKey: 'POST /users',
      body: JSON.stringify(createUserPayload),
    });

    let parsedCreateResponse;

    let createResult;
    let getAllResult;
    let getByIdResult;

    const getAllEvent = getAPIGatewayV2Payload({ routeKey: 'GET /users' });

    let getByIdEvent;

    beforeAll(async () => {
      createResult = await controller.handleRequest(createEvent);

      parsedCreateResponse = JSON.parse(
        Buffer.from(createResult.body, 'base64').toString(),
      );

      getAllResult = await controller.handleRequest(getAllEvent);

      getByIdEvent = getAPIGatewayV2Payload({
        routeKey: 'GET /users/{id}',
        pathParameters: {
          id: parsedCreateResponse.data.id,
        },
      });

      getByIdResult = await controller.handleRequest(getByIdEvent);
    });

    afterAll(async () => {
      const dataSource = app.get(DataSource);

      await dataSource.createQueryBuilder().delete().from(User).execute();

      await app.close();
    });

    describe('Create', () => {
      it('should have status 200', async () => {
        expect(createResult).toHaveProperty('statusCode', 200);
      });

      it('should have valid requestId', async () => {
        expect(createResult).toHaveProperty(
          'headers.x-app-request-id',
          createEvent.requestContext.requestId,
        );
      });

      it('should have data.id', async () => {
        expect(parsedCreateResponse).toHaveProperty('data.id');
        expect(parsedCreateResponse.data.id).toBeDefined();
      });

      it('should have data.email', async () => {
        expect(parsedCreateResponse).toHaveProperty(
          'data.email',
          createUserPayload.email,
        );
      });
    });

    describe('GetAll', () => {
      let parsedGetAllResponse;

      beforeAll(() => {
        parsedGetAllResponse = JSON.parse(
          Buffer.from(getAllResult.body, 'base64').toString(),
        );
      });

      it('should have 1 row', async () => {
        expect(parsedGetAllResponse.data).toHaveLength(1);
      });

      it('should have valid id', async () => {
        expect(parsedGetAllResponse.data[0]).toHaveProperty('id');
        expect(parsedGetAllResponse.data[0].id).toBeDefined();
      });

      it('should have valid email', async () => {
        expect(parsedGetAllResponse.data[0]).toHaveProperty(
          'email',
          createUserPayload.email,
        );
      });

      it('should have valid requestId', async () => {
        expect(getAllResult).toHaveProperty(
          'headers.x-app-request-id',
          getAllEvent.requestContext.requestId,
        );
      });
    });

    describe('GetById', () => {
      let parsedGetByIdResponse;

      beforeAll(() => {
        parsedGetByIdResponse = JSON.parse(
          Buffer.from(getByIdResult.body, 'base64').toString(),
        );
      });

      it('should have valid id', async () => {
        expect(parsedGetByIdResponse).toHaveProperty(
          'data.id',
          parsedCreateResponse.data.id,
        );
      });

      it('should have valid email', async () => {
        expect(parsedGetByIdResponse).toHaveProperty(
          'data.email',
          parsedCreateResponse.data.email,
        );
      });

      it('should have valid requestId', async () => {
        expect(getByIdResult).toHaveProperty(
          'headers.x-app-request-id',
          getByIdEvent.requestContext.requestId,
        );
      });
    });
  });
});
