import { Injectable } from '@nestjs/common';

import { LambdaLogsService } from '@guini/lambda-logs';
import { ClientError } from '@guini/lambda-validator/errors/clientError';
import { QueryFailedError } from 'typeorm';

@Injectable()
export default class ErrorHandler {
  private earlyResponse;

  private readonly driverErrorHumanMap = {
    users_email_key: 'Duplicated email',
  };

  constructor(private logger: LambdaLogsService) {
    // By default is our error, trying our best to identify the error.
    this.earlyResponse = {
      status: 500,
      body: {
        data: undefined,
        error: 'Internal Server Error',
        requestId: undefined,
      },
    };
  }

  private handleClientError(error: ClientError) {
    this.earlyResponse.status = 400;
    this.earlyResponse.body.error = { message: error.message };

    return this.earlyResponse;
  }

  // @TODO replace object with better type
  private handleQueryFailedError(error: QueryFailedError) {
    // @TODO move this to a proper handler, this is just a PoC

    if (error.driverError.code === '23505') {
      this.earlyResponse.status = 400;

      //   // @TODO not proud of this message..
      this.earlyResponse.body.error = {
        message: this.driverErrorHumanMap[error.driverError.constraint],
      };
    }

    return this.earlyResponse;
  }

  handle(error: ClientError | Error) {
    if (error instanceof ClientError) {
      return this.handleClientError(error);
    }

    if (error instanceof QueryFailedError) {
      return this.handleQueryFailedError(error);
    }

    // If we don't have a proper message to the client, just 500
    this.logger.error(error.message);

    return this.earlyResponse;
  }
}
