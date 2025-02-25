import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const createSchema = Joi.object({
  email: Joi.string().email().required(),
});

export class CreateDto {
  @ApiProperty()
  email: string;
}
