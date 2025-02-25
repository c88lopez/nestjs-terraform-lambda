import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';

import { APIGatewayProxyEventV2, Callback, Context, Handler } from 'aws-lambda';

import { LambdaLogsService } from '@guini/lambda-logs';

import Module from './module';

let server: Handler;

async function bootstrap({
  requestContext: { requestId },
}: APIGatewayProxyEventV2): Promise<Handler> {
  const app = await NestFactory.create(Module, { bufferLogs: true });

  const loggerInstance = app.get(LambdaLogsService);
  loggerInstance.setLogLevels(['debug', 'error', 'log', 'verbose', 'warn']);
  loggerInstance.setRequestId(requestId);

  app.useLogger(loggerInstance);
  app.flushLogs();

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap(event));
  return server(event, context, callback);
};
