import { Injectable } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ClientError } from '@guini/lambda-validator/errors/clientError';

@Injectable()
export class LambdaValidatorService {
  validate(value: object, schema: ObjectSchema): boolean {
    const { error } = schema.validate(value);

    if (error) {
      throw new ClientError(error.message);
    }

    return true;
  }
}
