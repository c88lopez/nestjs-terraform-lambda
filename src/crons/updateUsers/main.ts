import { INestApplicationContext } from '@nestjs/common';
import { LambdaLogsService } from '@guini/lambda-logs';
import { EventBridgeEvent } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';

import Module from './module';

let appInstance: INestApplicationContext;

async function initAppInstance(): Promise<void> {
  if (!appInstance) {
    appInstance = await NestFactory.createApplicationContext(Module, {
      bufferLogs: true,
    });
  }
}

const initLogger = ({
  id,
}: EventBridgeEvent<'Scheduled Event', EventDetail>) => {
  const loggerInstance = appInstance.get(LambdaLogsService);

  loggerInstance.setLogLevels(['debug', 'error', 'log', 'verbose', 'warn']);
  loggerInstance.setRequestId(id);

  appInstance.useLogger(loggerInstance);
};

type EventDetail = {
  entity: 'units';
};

export async function handler(
  event: EventBridgeEvent<'Scheduled Event', EventDetail>,
): Promise<boolean> {
  console.log(event.detail.entity);

  await initAppInstance();

  initLogger(event);
  //
  // const controller = appInstance.get(Service);
  //
  // return controller.process(event);

  return true;
}
