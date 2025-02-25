import { ApiProperty } from "@nestjs/swagger";

export default class UserResponse implements bla {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  constructor({id, userName, ...}) {
  }
}