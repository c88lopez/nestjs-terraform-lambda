import { Injectable } from '@nestjs/common';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

type EarlyResponse = {
  status?: number;
  headers?: { [key: string]: string };
  body?: object;
};

@Injectable()
export class LambdaResponseService {
  private buildHeaders(rawHeaders): EarlyResponse['headers'] {
    return {
      'Content-Type': 'application/json',
      ...rawHeaders,
    };
  }

  private buildBody(rawBody: EarlyResponse['body']): string | undefined {
    if (rawBody) {
      const buffer = Buffer.from(JSON.stringify(rawBody));

      return buffer.toString('base64');
    }
  }

  build({
    status = 200,
    headers: rawHeaders,
    body: rawBody,
  }: EarlyResponse): APIGatewayProxyStructuredResultV2 {
    return {
      statusCode: status,
      headers: this.buildHeaders(rawHeaders),
      body: this.buildBody(rawBody),
      isBase64Encoded: true,
    };
  }
}
