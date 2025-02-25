import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

type messageStructure = {
  logLevel: LogLevel;
  requestId: string;
  payload: {
    message: unknown;
    timestampDiff?: string;
  };
  context: string;
};

@Injectable()
export class LambdaLogsService extends ConsoleLogger {
  private requestId: string;

  public setRequestId(newRequestId: string): LambdaLogsService {
    this.requestId = newRequestId;

    return this;
  }

  protected formatContext(context: string): string {
    return context;
  }

  protected colorize(message: string): string {
    return message;
  }

  protected formatMessage(logLevel: LogLevel, message: unknown): string {
    return (
      JSON.stringify({
        logLevel,
        requestId: this.requestId,
        payload: {
          message,
        },
      } as messageStructure) + '\n'
    );
  }
}
